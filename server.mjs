// Servidor estático mínimo para a Railway (sem dependências).
// Serve dist/ com fallback SPA (todas as rotas voltam para index.html),
// para /simulado, /questoes e /progresso funcionarem com link direto.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')
const PORT = Number(process.env.PORT || 8080)

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

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, app: 'oab-passe-rapido' }))
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
  console.log(`OAB Passe Rápido ouvindo na porta ${PORT}`)
})
