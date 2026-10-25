import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MATERIAS, QUESTOES } from '@/data/questoes'
import { registrarSimulado } from '@/lib/progresso'
import { syncProgressToCloud } from '@/lib/nuvem'
import Layout from '@/components/Layout'
import { ArrowLeft, ArrowRight, RotateCcw, Trophy, Flag, Timer } from 'lucide-react'

const LETRAS = ['A', 'B', 'C', 'D']

function embaralhar(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function formatarTempo(seg) {
  const m = Math.floor(seg / 60)
  const s = seg % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Simulado() {
  const [params] = useSearchParams()
  const [materia, setMateria] = useState(params.get('materia') || 'Todas')
  const [quantidade, setQuantidade] = useState(10)
  const [modo, setModo] = useState('estudo')
  const [duracao, setDuracao] = useState(0)
  const [iniciado, setIniciado] = useState(false)
  const [lista, setLista] = useState([])
  const [indice, setIndice] = useState(0)
  const [escolha, setEscolha] = useState(null)
  const [respostas, setRespostas] = useState({})
  const [finalizado, setFinalizado] = useState(false)
  // Modo prova
  const [tempoRestante, setTempoRestante] = useState(0)
  const [provaRespostas, setProvaRespostas] = useState({})
  const [marcadas, setMarcadas] = useState([])

  const disponiveis = useMemo(() => {
    const base = materia === 'Todas' ? QUESTOES : QUESTOES.filter((q) => q.materia === materia)
    return base
  }, [materia])

  function guardarRevisao(respostasBool, listaQ) {
    try {
      const erradas = listaQ.filter((q) => respostasBool[q.id] === false).map((q) => q.id)
      localStorage.setItem('oab_revisao_ids', JSON.stringify(erradas))
    } catch { /* ignore */ }
  }
  function aposSalvar() {
    syncProgressToCloud().catch(() => {})
  }

  function comecar() {
    const sorteadas = embaralhar(disponiveis).slice(0, Math.min(quantidade, disponiveis.length))
    setLista(sorteadas)
    setIndice(0)
    setEscolha(null)
    setRespostas({})
    setProvaRespostas({})
    setMarcadas([])
    setFinalizado(false)
    if (modo === 'prova') {
      setTempoRestante(duracao > 0 ? duracao * 60 : sorteadas.length * 180)
    }
    setIniciado(true)
  }

  // Timer do modo prova: só conta, sem efeitos colaterais no intervalo.
  useEffect(() => {
    if (!iniciado || modo !== 'prova' || finalizado) return undefined
    const id = setInterval(() => setTempoRestante((t) => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [iniciado, modo, finalizado])

  function finalizarProva(automatico) {
    const boolMap = {}
    lista.forEach((q) => { boolMap[q.id] = provaRespostas[q.id] === q.correta })
    if (!automatico) {
      const semResposta = lista.filter((q) => provaRespostas[q.id] === undefined).length
      if (semResposta > 0 && !window.confirm(`Ainda há ${semResposta} questão(ões) sem resposta. Elas contarão como erro. Finalizar mesmo assim?`)) return
    }
    const acertos = Object.values(boolMap).filter(Boolean).length
    setRespostas(boolMap)
    registrarSimulado({ materia: `${materia} (Prova)`, total: lista.length, acertos, respostas: boolMap })
    guardarRevisao(boolMap, lista)
    aposSalvar()
    setFinalizado(true)
  }

  // Quando o timer zera, finaliza sozinho.
  useEffect(() => {
    if (iniciado && modo === 'prova' && !finalizado && tempoRestante === 0 && lista.length) {
      finalizarProva(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempoRestante])

  function confirmar() {
    if (escolha === null) return
    const q = lista[indice]
    const novas = { ...respostas, [q.id]: escolha === q.correta }
    setRespostas(novas)
    if (indice + 1 >= lista.length) {
      const acertos = Object.values(novas).filter(Boolean).length
      registrarSimulado({ materia, total: lista.length, acertos, respostas: novas })
      guardarRevisao(novas, lista)
      aposSalvar()
      setFinalizado(true)
    } else {
      setIndice(indice + 1)
      setEscolha(null)
    }
  }

  if (!iniciado) {
    return (
      <Layout>
        <h1 className="text-2xl font-bold mb-4">Simulado</h1>
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div>
              <p className="text-sm font-medium mb-2">Matéria</p>
              <div className="flex flex-wrap gap-2">
                {['Todas', ...MATERIAS].map((m) => (
                  <Button key={m} variant={materia === m ? 'default' : 'outline'} onClick={() => setMateria(m)}>{m}</Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Quantidade de questões</p>
              <div className="flex gap-2 flex-wrap">
                {[5, 10, 20].map((n) => (
                  <Button key={n} variant={quantidade === n ? 'default' : 'outline'} onClick={() => setQuantidade(n)}>{n}</Button>
                ))}
                <Button variant={quantidade === 999 ? 'default' : 'outline'} onClick={() => setQuantidade(999)}>Todas ({disponiveis.length})</Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Modo</p>
              <div className="flex gap-2 flex-wrap">
                <Button variant={modo === 'estudo' ? 'default' : 'outline'} onClick={() => setModo('estudo')}>Estudo (sem timer)</Button>
                <Button variant={modo === 'prova' ? 'default' : 'outline'} onClick={() => setModo('prova')}>Prova (com timer)</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {modo === 'estudo'
                  ? 'Uma questão por vez, sem voltar. Ao final, nota e revisão com explicações.'
                  : 'Como uma prova de verdade: timer, navegação livre entre questões, marcação para revisar e finalização automática quando o tempo acaba. Sem gabarito durante a prova.'}
              </p>
            </div>
            {modo === 'prova' && (
              <div>
                <p className="text-sm font-medium mb-2">Tempo da prova</p>
                <div className="flex gap-2 flex-wrap">
                  {[15, 30, 60].map((n) => (
                    <Button key={n} variant={duracao === n ? 'default' : 'outline'} onClick={() => setDuracao(n)}>{n} min</Button>
                  ))}
                  <Button variant={duracao === 0 ? 'default' : 'outline'} onClick={() => setDuracao(0)}>Automático (3 min por questão)</Button>
                </div>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {disponiveis.length} questões disponíveis nesta seleção.
            </p>
            <Button size="lg" onClick={comecar} disabled={!disponiveis.length}>Começar {modo === 'prova' ? 'prova' : 'simulado'}</Button>
          </CardContent>
        </Card>
      </Layout>
    )
  }

  if (finalizado) {
    const acertos = Object.values(respostas).filter(Boolean).length
    const percentual = lista.length ? Math.round((acertos / lista.length) * 100) : 0
    const erradas = lista.filter((q) => respostas[q.id] === false).length
    return (
      <Layout>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Resultado {modo === 'prova' ? 'da prova' : 'do simulado'}</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <p className="text-3xl font-bold">{acertos} de {lista.length} certas ({percentual}%)</p>
            <p className="text-sm text-muted-foreground">
              {percentual >= 70 ? 'Ótimo desempenho. Continue revisando as que errou para fixar.' : 'Revise as explicações abaixo e refaça em outro momento.'}
              {erradas > 0 && ' A revisão de erros já está pronta na página Revisão.'}
            </p>
            <div className="space-y-4">
              {lista.map((q, i) => (
                <div key={q.id} className="border rounded-xl p-4">
                  <p className="font-medium">{i + 1}. {q.enunciado}</p>
                  <p className={`text-sm mt-1 ${respostas[q.id] ? 'text-emerald-700' : 'text-red-600'}`}>
                    {respostas[q.id] ? 'Você acertou' : 'Você errou'} — resposta certa: {LETRAS[q.correta]}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{q.explicacao}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => { setIniciado(false); setFinalizado(false) }}><RotateCcw className="w-4 h-4 mr-2" /> Novo simulado</Button>
              {erradas > 0 && <Link to="/revisao"><Button variant="outline">Revisar só as que errei ({erradas})</Button></Link>}
              <Link to="/progresso"><Button variant="outline">Ver progresso</Button></Link>
            </div>
          </CardContent>
        </Card>
      </Layout>
    )
  }

  const q = lista[indice]

  if (modo === 'prova') {
    const respondidas = Object.keys(provaRespostas).length
    const urgente = tempoRestante < 300
    return (
      <Layout>
        <div className="sticky top-[68px] z-10 bg-white border rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-2 shadow-sm">
          <span className={`flex items-center gap-1.5 font-bold ${urgente ? 'text-red-600' : 'text-slate-800'}`}>
            <Timer className="w-5 h-5" /> {formatarTempo(tempoRestante)}
          </span>
          <span className="text-sm text-muted-foreground">Questão {indice + 1} de {lista.length} · {respondidas} respondidas · {marcadas.length} marcadas</span>
          <Button size="sm" variant="destructive" onClick={() => finalizarProva(false)}>Finalizar prova</Button>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {lista.map((item, i) => {
            const respondida = provaRespostas[item.id] !== undefined
            const marcada = marcadas.includes(item.id)
            return (
              <button
                key={item.id}
                onClick={() => setIndice(i)}
                className={`w-10 h-10 rounded-lg border text-sm font-medium ${
                  i === indice ? 'ring-2 ring-emerald-700 border-emerald-700'
                  : marcada ? 'bg-amber-100 border-amber-400'
                  : respondida ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white'
                }`}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground">{q.materia}</p>
            <p className="text-lg font-medium leading-relaxed">{q.enunciado}</p>
            <div className="space-y-2">
              {q.alternativas.map((alt, i) => (
                <button
                  key={i}
                  onClick={() => setProvaRespostas({ ...provaRespostas, [q.id]: i })}
                  className={`w-full text-left border rounded-xl p-4 flex gap-3 min-h-[56px] items-start ${provaRespostas[q.id] === i ? 'border-emerald-700 bg-emerald-50' : 'hover:bg-slate-50'}`}
                >
                  <span className="font-bold">{LETRAS[i]}.</span><span>{alt}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" disabled={indice === 0} onClick={() => setIndice(indice - 1)}><ArrowLeft className="w-4 h-4 mr-1" /> Anterior</Button>
              <Button variant="outline" disabled={indice + 1 >= lista.length} onClick={() => setIndice(indice + 1)}>Próxima <ArrowRight className="w-4 h-4 ml-1" /></Button>
              <Button
                variant={marcadas.includes(q.id) ? 'default' : 'outline'}
                onClick={() => setMarcadas(marcadas.includes(q.id) ? marcadas.filter((id) => id !== q.id) : [...marcadas, q.id])}
              >
                <Flag className="w-4 h-4 mr-1" /> {marcadas.includes(q.id) ? 'Desmarcar' : 'Marcar para revisar'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Na prova, o gabarito só aparece no resultado final.</p>
          </CardContent>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setIniciado(false)} className="text-sm flex items-center gap-1 text-slate-600 min-h-[44px]"><ArrowLeft className="w-4 h-4" /> Sair do simulado</button>
        <p className="text-sm text-muted-foreground">Questão {indice + 1} de {lista.length} · {q.materia}</p>
      </div>
      <div className="h-2 bg-slate-200 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-emerald-700" style={{ width: `${((indice) / lista.length) * 100}%` }} />
      </div>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <p className="text-lg font-medium leading-relaxed">{q.enunciado}</p>
          <div className="space-y-2">
            {q.alternativas.map((alt, i) => (
              <button
                key={i}
                onClick={() => setEscolha(i)}
                className={`w-full text-left border rounded-xl p-4 flex gap-3 min-h-[56px] items-start ${escolha === i ? 'border-emerald-700 bg-emerald-50' : 'hover:bg-slate-50'}`}
              >
                <span className="font-bold">{LETRAS[i]}.</span><span>{alt}</span>
              </button>
            ))}
          </div>
          <Button size="lg" onClick={confirmar} disabled={escolha === null}>
            {indice + 1 >= lista.length ? 'Ver resultado' : 'Próxima'} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </Layout>
  )
}
