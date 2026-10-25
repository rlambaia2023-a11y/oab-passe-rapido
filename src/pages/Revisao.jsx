import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QUESTOES } from '@/data/questoes'
import { lerRespostas, questoesErradas, registrarSimulado } from '@/lib/progresso'
import { syncProgressToCloud } from '@/lib/nuvem'
import Layout from '@/components/Layout'
import { Target, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'

const LETRAS = ['A', 'B', 'C', 'D']

function idsRecentes() {
  try {
    const ids = JSON.parse(localStorage.getItem('oab_revisao_ids') || '[]')
    return Array.isArray(ids) ? ids : []
  } catch { return [] }
}

export default function Revisao() {
  const [modoQuiz, setModoQuiz] = useState(false)
  const [lista, setLista] = useState([])
  const [indice, setIndice] = useState(0)
  const [escolha, setEscolha] = useState(null)
  const [revelado, setRevelado] = useState(false)
  const [resultado, setResultado] = useState({})
  const [terminou, setTerminou] = useState(false)
  const [versao, setVersao] = useState(0)

  // Releitura a cada render relevante: erros reais, não lista fixa.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const erradas = useMemo(() => questoesErradas(), [versao])
  const recentes = useMemo(() => {
    const ids = idsRecentes()
    if (!ids.length) return []
    return QUESTOES.filter((q) => ids.includes(q.id))
  }, [versao])

  const alvo = recentes.length ? recentes : erradas

  function comecarRevisao(usarRecentes) {
    const base = usarRecentes && recentes.length ? recentes : erradas
    if (!base.length) return
    setLista(base)
    setIndice(0)
    setEscolha(null)
    setRevelado(false)
    setResultado({})
    setTerminou(false)
    setModoQuiz(true)
  }

  function responder() {
    if (escolha === null) return
    const q = lista[indice]
    const certa = escolha === q.correta
    const novas = { ...resultado, [q.id]: certa }
    setResultado(novas)
    setRevelado(true)
  }
  function proxima() {
    if (indice + 1 >= lista.length) {
      // Atualiza o progresso real: acertou na revisão, sai da lista de erros.
      const atuais = lerRespostas()
      Object.entries(resultado).forEach(([id, certa]) => { if (certa) atuais[id] = true })
      // Também registra a revisão como simulado, para o histórico.
      const acertos = Object.values(resultado).filter(Boolean).length
      registrarSimulado({ materia: 'Revisão de erros', total: lista.length, acertos, respostas: resultado })
      // registrarSimulado já gravou todas as respostas do quiz; se alguma
      // estava certa antes e o usuário errou na revisão, ela volta a ser erro.
      // Isso é intencional: a revisão reflete o desempenho atual.
      syncProgressToCloud().catch(() => {})
      try { localStorage.removeItem('oab_revisao_ids') } catch { /* ignore */ }
      setTerminou(true)
      setVersao((v) => v + 1)
    } else {
      setIndice(indice + 1)
      setEscolha(null)
      setRevelado(false)
    }
  }

  if (modoQuiz && !terminou) {
    const q = lista[indice]
    return (
      <Layout>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setModoQuiz(false)} className="text-sm text-slate-600 min-h-[44px]">Voltar para a lista</button>
          <p className="text-sm text-muted-foreground">Revisão {indice + 1} de {lista.length}</p>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground">{q.materia} · você errou esta antes</p>
            <p className="text-lg font-medium leading-relaxed">{q.enunciado}</p>
            <div className="space-y-2">
              {q.alternativas.map((alt, i) => (
                <button
                  key={i}
                  disabled={revelado}
                  onClick={() => setEscolha(i)}
                  className={`w-full text-left border rounded-xl p-4 flex gap-3 min-h-[56px] items-start ${
                    revelado && i === q.correta ? 'border-emerald-700 bg-emerald-50'
                    : revelado && i === escolha ? 'border-red-400 bg-red-50'
                    : escolha === i ? 'border-emerald-700 bg-emerald-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold">{LETRAS[i]}.</span><span>{alt}</span>
                </button>
              ))}
            </div>
            {revelado ? (
              <div className="space-y-3">
                <p className={`text-sm font-medium ${escolha === q.correta ? 'text-emerald-700' : 'text-red-600'}`}>
                  {escolha === q.correta ? 'Acertou na revisão. Esta sai da sua lista de erros.' : `Ainda errou. Resposta certa: ${LETRAS[q.correta]}.`}
                </p>
                <p className="text-sm text-slate-600">{q.explicacao}</p>
                <Button size="lg" onClick={proxima}>{indice + 1 >= lista.length ? 'Ver resultado da revisão' : 'Próxima'}</Button>
              </div>
            ) : (
              <Button size="lg" onClick={responder} disabled={escolha === null}>Confirmar resposta</Button>
            )}
          </CardContent>
        </Card>
      </Layout>
    )
  }

  if (modoQuiz && terminou) {
    const acertos = Object.values(resultado).filter(Boolean).length
    const restantes = questoesErradas().length
    return (
      <Layout>
        <Card>
          <CardHeader><CardTitle>Resultado da revisão</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">{acertos} de {lista.length} certas na revisão</p>
            <p className="text-sm text-muted-foreground">
              {restantes === 0 ? 'Nenhum erro pendente. Parabéns.' : `Ainda restam ${restantes} questão(ões) errada(s) no total.`}
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => { setModoQuiz(false); setTerminou(false) }}>Voltar para a lista de erros</Button>
              <Link to="/progresso"><Button variant="outline">Ver progresso</Button></Link>
            </div>
          </CardContent>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Target className="w-6 h-6 text-red-600" /> Revisão de erros</h1>
      <p className="text-sm text-muted-foreground mb-5">
        Aqui só entram questões que você realmente errou. Quando acerta na revisão, ela sai da lista.
        {recentes.length > 0 && ' Abaixo, primeiro as do seu último simulado/prova.'}
      </p>

      {recentes.length > 0 && (
        <Card className="mb-5 border-amber-200">
          <CardContent className="pt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium">Do último simulado/prova: {recentes.length} errada(s)</p>
            <Button onClick={() => comecarRevisao(true)}><RotateCcw className="w-4 h-4 mr-2" /> Refazer só essas</Button>
          </CardContent>
        </Card>
      )}

      {erradas.length === 0 ? (
        <Card>
          <CardContent className="pt-6 flex gap-3 items-start">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5" />
            <p className="text-sm text-slate-600">Nenhum erro pendente. Faça um simulado ou uma prova e, se errar alguma, ela aparece aqui.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <p className="font-medium">{erradas.length} questão(ões) errada(s) no total</p>
            <Button onClick={() => comecarRevisao(false)}>Refazer todas as erradas</Button>
          </div>
          <div className="space-y-4">
            {erradas.map((q) => (
              <Card key={q.id}>
                <CardContent className="pt-5 space-y-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-red-600" /> {q.materia} · errada</p>
                  <p className="font-medium leading-relaxed">{q.enunciado}</p>
                  <p className="text-sm text-slate-600">Resposta certa: <strong>{LETRAS[q.correta]}</strong> — {q.explicacao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}
