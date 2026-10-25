// Adaptado: sem SDK do Base44. O token local vive no localStorage.
const isNode = typeof window === 'undefined'

const isClearAccessTokenRequested = () =>
  !isNode && new URLSearchParams(window.location.search).get('clear_access_token') === 'true'

const clearStoredAccessToken = () => {
  window.localStorage.removeItem('oab_token')
  window.localStorage.removeItem('base44_access_token')
  window.localStorage.removeItem('token')
}

const getAppParams = () => {
  if (isClearAccessTokenRequested()) {
    clearStoredAccessToken()
  }
  let token = null
  try {
    const session = JSON.parse(window.localStorage.getItem('oab_token') || 'null')
    token = session?.token || null
  } catch { token = null }
  return {
    appId: 'oab-passe-rapido-local',
    token,
    functionsVersion: null,
    appBaseUrl: '',
  }
}

export const appParams = {
  ...getAppParams(),
}
