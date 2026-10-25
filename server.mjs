// Servidor do OAB Passe Rápido (sem dependências).
// 1) Serve dist/ com fallback SPA (rotas /simulado, /questoes, /progresso, /revisao...).
// 2) API de nuvem em /api/*: contas e progresso.
//    - Dados em DATA_DIR (ou /app/data se existir, ou ./data).
//    - Sem volume na Railway, os dados somem a cada redeploy. Com volume
//      montado em /app/data, eles sobrevivem. É o mesmo ponto de atenção
//      do fbbrmuseia, mas aqui é só o serviço oab-passe-rapido.
//    - Senhas: scrypt com salt, nunca em texto claro. Tokens aleatórios.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')
const PORT = Number(process.env.PORT || 8080)
const DATA_DIR = process.env.DATA_DIR || (fs.existsSync('/app/data') ? '/app/data' : path.join(__dirname, 'data'))
const DB_FILE = path.join(DATA_DIR, 'oab-db.json')

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function loadDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8')
    const db = JSON.parse(raw)
    if (!db.users) db.users = {}
    if (!db.tokens) db.tokens = {}
    return db
  } catch {
    return { users: {}, tokens: {} }
  }
}
function saveDb(db) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  const tmp = DB_FILE + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(db))
  fs.renameSync(tmp, DB_FILE)
}
let db = loadDb()

function json(res, status, obj) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(obj))
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > 1_000_000) {
        reject(new Error('Corpo muito grande'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => {
      try { resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf-8')) : {}) }
      catch { reject(new Error('JSON inválido')) }
    })
    req.on('error', reject)
  })
}
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex')
}
function authEmail(req) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : null
  if (!token) return null
  return db.tokens[token] || null
}
function cleanAnswers(answers) {
  const out = {}
  if (answers && typeof answers === 'object') {
    for (const [k, v] of Object.entries(answers)) {
      if (typeof k === 'string' && k.length < 100 && typeof v === 'boolean') out[k] = v
    }
  }
  return out
}
function cleanHistory(history) {
  if (!Array.isArray(history)) return []
  return history
    .filter((h) => h && typeof h.total === 'number' && typeof h.acertos === 'number' && typeof h.materia === 'string')
    .map((h) => ({ data: typeof h.data === 'string' ? h.data : new Date().toISOString(), materia: h.materia.slice(0, 80), total: h.total, acertos: h.acertos }))
    .slice(0, 100)
}
function mergeHistory(oldH, newH) {
  const seen = new Set()
  const merged = []
  for (const h of [...newH, ...oldH]) {
    const key = `${h.data}|${h.materia}|${h.total}|${h.acertos}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(h)
  }
  merged.sort((a, b) => String(b.data).localeCompare(String(a.data)))
  return merged.slice(0, 100)
}

async function handleApi(req, res, url) {
  const pathname = url.pathname
  try {
    if (req.method === 'POST' && (pathname === '/api/auth/register' || pathname === '/api/auth/login')) {
      const body = await readBody(req)
      const email = String(body.email || '').trim().toLowerCase()
      const password = String(body.password || '')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(res, 400, { error: 'E-mail inválido' })
      if (password.length < 6) return json(res, 400, { error: 'A senha precisa ter pelo menos 6 caracteres' })
      if (pathname === '/api/auth/register') {
        if (db.users[email]) return json(res, 409, { error: 'Já existe uma conta na nuvem com este e-mail. Entre com ela.' })
        const salt = crypto.randomBytes(16).toString('hex')
        db.users[email] = { salt, hash: hashPassword(password, salt), progress: { answers: {}, history: [] } }
      } else {
        const user = db.users[email]
        if (!user || user.hash !== hashPassword(password, user.salt)) {
          return json(res, 401, { error: 'E-mail ou senha inválidos na nuvem' })
        }
      }
      const token = crypto.randomBytes(32).toString('hex')
      db.tokens[token] = email
      saveDb(db)
      return json(res, 200, { token, email })
    }

    const email = authEmail(req)
    if (!email) return json(res, 401, { error: 'Não autenticado na nuvem' })
    const user = db.users[email]
    if (!user) return json(res, 401, { error: 'Conta não encontrada' })

    if (req.method === 'GET' && pathname === '/api/auth/me') {
      return json(res, 200, { email })
    }
    if (req.method === 'GET' && pathname === '/api/progress') {
      return json(res, 200, { answers: user.progress.answers || {}, history: user.progress.history || [] })
    }
    if (req.method === 'DELETE' && pathname === '/api/progress') {
      // Limpar progresso na nuvem: usado quando o usuário zera o histórico
      // para recomeçar. Sem isso, o próximo sync devolveria os dados antigos
      // e o nunca-repetir voltaria a considerar as questões já feitas.
      user.progress = { answers: {}, history: [] }
      saveDb(db)
      return json(res, 200, { answers: {}, history: [] })
    }
    if (req.method === 'PUT' && pathname === '/api/progress') {
      const body = await readBody(req)
      const answers = { ...(user.progress.answers || {}), ...cleanAnswers(body.answers) }
      const history = mergeHistory(user.progress.history || [], cleanHistory(body.history))
      user.progress = { answers, history }
      saveDb(db)
      return json(res, 200, { answers, history })
    }
    return json(res, 404, { error: 'Rota da API não encontrada' })
  } catch (e) {
    return json(res, 400, { error: e.message || 'Requisição inválida' })
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, app: 'oab-passe-rapido', nuvem: true, data_dir: DATA_DIR }))
    return
  }
  if (url.pathname.startsWith('/api/')) {
    await handleApi(req, res, url)
    return
  }
  let filePath = path.join(DIST, decodeURIComponent(url.pathname))
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, 'index.html')
  }
  const ext = path.extname(filePath).toLowerCase()
  res.writeHead(200, { 'content-type': TYPES[ext] || 'application/octet-stream' })
  fs.createReadStream(filePath).pipe(res)
})

server.listen(PORT, () => {
  console.log(`OAB Passe Rápido ouvindo na porta ${PORT} (dados em ${DATA_DIR})`)
})
