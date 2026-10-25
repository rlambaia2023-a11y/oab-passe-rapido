// Compatibilidade: mantém o nome/import `base44` usado pelas páginas antigas,
// mas implementa tudo LOCALMENTE (localStorage), sem Base44, sem servidor.
// Atenção: isto é um modo local, para estudo no próprio navegador.
// Não use como login seguro multiusuário em produção: as contas ficam
// apenas neste navegador. O progresso de estudos também é local.
const USERS_KEY = 'oab_users'
const SESSION_KEY = 'oab_token'

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}
function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}
async function hashPassword(password) {
  try {
    const data = new TextEncoder().encode('oab-passe-rapido::' + password)
    const buf = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    // Fallback apenas se WebCrypto não estiver disponível.
    let h = 0
    for (let i = 0; i < password.length; i++) h = (h * 31 + password.charCodeAt(i)) >>> 0
    return 'fallback-' + h
  }
}
function makeToken(email) {
  return 'local-' + btoa(email + ':' + Date.now() + ':' + Math.random().toString(36).slice(2))
}
function currentSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}

export const base44 = {
  app: {
    async getPublicSettings() {
      return { id: 'oab-passe-rapido-local', public_settings: {} }
    },
  },
  auth: {
    async me() {
      const session = currentSession()
      if (!session) {
        const err = new Error('Não autenticado')
        err.status = 401
        throw err
      }
      const user = readUsers().find((u) => u.email === session.email)
      if (!user) {
        const err = new Error('Não autenticado')
        err.status = 401
        throw err
      }
      return { email: user.email, role: user.role || 'user' }
    },
    async loginViaEmailPassword(email, password) {
      const user = readUsers().find((u) => u.email === String(email).toLowerCase())
      if (!user) throw new Error('E-mail ou senha inválidos')
      if (user.passwordHash !== (await hashPassword(password))) {
        throw new Error('E-mail ou senha inválidos')
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, token: makeToken(user.email) }))
      return { email: user.email }
    },
    async register({ email, password }) {
      const normalized = String(email).toLowerCase()
      const users = readUsers()
      if (users.find((u) => u.email === normalized)) throw new Error('Já existe uma conta com este e-mail')
      users.push({ email: normalized, passwordHash: await hashPassword(password), role: 'user' })
      writeUsers(users)
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: normalized, token: makeToken(normalized) }))
      return { email: normalized }
    },
    // No modo local não há OTP por e-mail: mantido só para compatibilidade.
    async verifyOtp() {
      const session = currentSession()
      return { access_token: session?.token || '' }
    },
    async resendOtp() {
      return true
    },
    loginWithProvider() {
      // Login com Google não existe no modo local.
      throw new Error('Login com Google não está disponível no modo local. Crie uma conta com e-mail e senha.')
    },
    redirectToLogin(returnTo) {
      window.location.href = '/login' + (returnTo && returnTo !== '/' ? '?returnTo=' + encodeURIComponent(returnTo) : '')
    },
    logout(returnTo) {
      localStorage.removeItem(SESSION_KEY)
      if (returnTo) window.location.href = '/login'
    },
    setToken(token) {
      try {
        const session = currentSession()
        if (session) localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, token }))
      } catch { /* ignore */ }
    },
    async resetPasswordRequest(email) {
      localStorage.setItem('oab_reset_email', String(email).toLowerCase())
      return true
    },
    async resetPassword({ newPassword }) {
      const email = localStorage.getItem('oab_reset_email')
      const users = readUsers()
      const user = users.find((u) => u.email === email)
      if (!user) throw new Error('Conta não encontrada para redefinir a senha')
      user.passwordHash = await hashPassword(newPassword)
      writeUsers(users)
      localStorage.removeItem('oab_reset_email')
      return true
    },
  },
}

export function getAccessToken() {
  return currentSession()?.token || null
}
