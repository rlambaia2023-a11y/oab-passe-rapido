// Cliente da API de nuvem (mesma origem, /api/*).
// Sem conta na nuvem, o app continua funcionando só no navegador.
// Com conta, o progresso sobe e desce; a mescla nunca apaga o que já
// existe: respostas locais valem para as questões que elas cobrem, e o
// histórico é unido sem duplicar.
import { lerRespostas, lerHistorico, salvarRespostas, salvarHistorico } from '@/lib/progresso'

const TOKEN_KEY = 'oab_cloud_token'
const EMAIL_KEY = 'oab_cloud_email'

export function getCloudToken() {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}
export function getCloudEmail() {
  try { return localStorage.getItem(EMAIL_KEY) } catch { return null }
}
export function isCloud() {
  return Boolean(getCloudToken())
}
export function logoutCloud() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
  } catch { /* ignore */ }
}

class CloudUnavailable extends Error {
  constructor() { super('API da nuvem indisponível'); this.code = 'unavailable' }
}
export function isCloudUnavailable(err) {
  return err && err.code === 'unavailable'
}

async function api(path, method, body) {
  let res
  try {
    res = await fetch(path, {
      method,
      headers: {
        'content-type': 'application/json',
        ...(getCloudToken() ? { authorization: `Bearer ${getCloudToken()}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new CloudUnavailable()
  }
  let data = {}
  try { data = await res.json() } catch {
    // Resposta não-JSON (ex.: servidor antigo sem /api) = indisponível.
    throw new CloudUnavailable()
  }
  if (res.status === 404) throw new CloudUnavailable()
  if (!res.ok) {
    const err = new Error(data.error || 'Erro na nuvem')
    err.status = res.status
    throw err
  }
  return data
}

export function mesclarProgresso(cloudAnswers, cloudHistory) {
  const localAnswers = lerRespostas()
  const localHistory = lerHistorico()
  const answers = { ...(cloudAnswers || {}), ...localAnswers }
  const seen = new Set()
  const history = []
  for (const h of [...localHistory, ...(cloudHistory || [])]) {
    const key = `${h.data}|${h.materia}|${h.total}|${h.acertos}`
    if (seen.has(key)) continue
    seen.add(key)
    history.push(h)
  }
  history.sort((a, b) => String(b.data).localeCompare(String(a.data)))
  const mergedHistory = history.slice(0, 100)
  salvarRespostas(answers)
  salvarHistorico(mergedHistory)
  return { answers, history: mergedHistory }
}

export async function limparNuvem() {
  if (!isCloud()) return null
  return api('/api/progress', 'DELETE')
}
export async function syncProgressToCloud() {
  if (!isCloud()) return null
  return api('/api/progress', 'PUT', { answers: lerRespostas(), history: lerHistorico() })
}
export async function syncProgressFromCloud() {
  if (!isCloud()) return null
  const cloud = await api('/api/progress', 'GET')
  const merged = mesclarProgresso(cloud.answers, cloud.history)
  // Devolve ao servidor o que só existia neste navegador.
  try { await api('/api/progress', 'PUT', merged) } catch { /* o download já valeu */ }
  return merged
}

async function salvarSessao(data) {
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(EMAIL_KEY, data.email)
}

export async function registerCloud(email, password) {
  const data = await api('/api/auth/register', 'POST', { email, password })
  await salvarSessao(data)
  await syncProgressToCloud()
  return data
}
export async function loginCloud(email, password) {
  const data = await api('/api/auth/login', 'POST', { email, password })
  await salvarSessao(data)
  await syncProgressFromCloud()
  return data
}
