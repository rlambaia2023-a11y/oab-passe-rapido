import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MATERIAS, QUESTOES } from '@/data/questoes'
import { registrarSimulado } from '@/lib/progresso'
import Layout from '@/components/Layout'
import { ArrowLeft, ArrowRight, RotateCcw, Trophy } from 'lucide-react'

const LETRAS = ['A', 'B', 'C', 'D']

function embaralhar(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Simulado() {
  const [params] = useSearchParams()
  const [materia, setMateria] = useState(params.get('materia') || 'Todas')
  const [quantidade, setQuantidade] = useState(10)
  const [iniciado, setIniciado] = useState(false)
  const [lista, setLista] = useState([])
  const [indice, setIndice] = useState(0)
  const [escolha, setEscolha] = useState(null)
  const [respostas, setRespostas] = useState({})
  const [finalizado, setFinalizado] = useState(false)

  const disponiveis = useMemo(() => {
    const base = materia === 'Todas' ? QUESTOES : QUESTOES.filter((q) => q.materia === materia)
    return base
  }, [materia])

  function comecar() {
    const sorteadas = embaralhar(disponiveis).slice(0, Math.min(quantidade, disponiveis.length))
    setLista(sorteadas)
    setIndice(0)
    setEscolha(null)
    setRespostas({})
    setFinalizado(false)
    setIniciado(true)
  }

  function confirmar() {
    if (escolha === null) return
    const q = lista[indice]
    const novas = { ...respostas, [q.id]: escolha === q.correta }
    setRespostas(novas)
    if (indice + 1 >= lista.length) {
      const acertos = Object.values(novas).filter(Boolean).length
      registrarSimulado({ materia, total: lista.length, acertos, respostas: novas })
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
            <p className="text-sm text-muted-foreground">
              {disponiveis.length} questões disponíveis nesta seleção. Responda uma por vez; ao final você vê a nota e a revisão com explicações.
            </p>
            <Button size="lg" onClick={comecar} disabled={!disponiveis.length}>Começar simulado</Button>
          </CardContent>
        </Card>
      </Layout>
    )
  }

  if (finalizado) {
    const acertos = Object.values(respostas).filter(Boolean).length
    const percentual = Math.round((acertos / lista.length) * 100)
    return (
      <Layout>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Resultado do simulado</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <p className="text-3xl font-bold">{acertos} de {lista.length} certas ({percentual}%)</p>
            <p className="text-sm text-muted-foreground">
              {percentual >= 70 ? 'Ótimo desempenho. Continue revisando as que errou para fixar.' : 'Revise as explicações abaixo e refaça o simulado em outro momento.'}
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
              <Link to="/progresso"><Button variant="outline">Ver progresso</Button></Link>
            </div>
          </CardContent>
        </Card>
      </Layout>
    )
  }

  const q = lista[indice]
  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setIniciado(false)} className="text-sm flex items-center gap-1 text-slate-600"><ArrowLeft className="w-4 h-4" /> Sair do simulado</button>
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
                className={`w-full text-left border rounded-xl p-4 flex gap-3 ${escolha === i ? 'border-emerald-700 bg-emerald-50' : 'hover:bg-slate-50'}`}
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
