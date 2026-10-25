import { QUESTOES } from '@/data/questoes'

const ANSWERS_KEY = 'oab_respostas'
const HISTORY_KEY = 'oab_historico'

export function lerRespostas() {
  try { return JSON.parse(localStorage.getItem(ANSWERS_KEY) || '{}') } catch { return {} }
}
export function lerHistorico() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}
export function registrarSimulado({ materia, total, acertos, respostas }) {
  const atuais = lerRespostas()
  Object.entries(respostas).forEach(([id, certa]) => { atuais[id] = certa })
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(atuais))
  const historico = lerHistorico()
  historico.unshift({ data: new Date().toISOString(), materia, total, acertos })
  localStorage.setItem(HISTORY_KEY, JSON.stringify(historico.slice(0, 50)))
}
export function estatisticas() {
  const respostas = lerRespostas()
  const ids = Object.keys(respostas)
  const acertos = ids.filter((id) => respostas[id]).length
  const porMateria = {}
  QUESTOES.forEach((q) => {
    if (!(q.materia in porMateria)) porMateria[q.materia] = { total: 0, acertos: 0 }
    if (idIn(respostas, q.id)) {
      porMateria[q.materia].total += 1
      if (respostas[q.id]) porMateria[q.materia].acertos += 1
    }
  })
  return {
    respondidas: ids.length,
    acertos,
    percentual: ids.length ? Math.round((acertos / ids.length) * 100) : 0,
    simulados: lerHistorico().length,
    porMateria,
  }
}
function idIn(obj, id) { return Object.prototype.hasOwnProperty.call(obj, id) }
export function limparProgresso() {
  localStorage.removeItem(ANSWERS_KEY)
  localStorage.removeItem(HISTORY_KEY)
}
