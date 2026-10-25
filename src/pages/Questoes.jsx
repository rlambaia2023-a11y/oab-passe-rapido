import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MATERIAS, QUESTOES } from '@/data/questoes'
import Layout from '@/components/Layout'

const LETRAS = ['A', 'B', 'C', 'D']

export default function Questoes() {
  const [materia, setMateria] = useState('Todas')
  const [busca, setBusca] = useState('')
  const [abertas, setAbertas] = useState({})

  const lista = QUESTOES.filter((q) => {
    if (materia !== 'Todas' && q.materia !== materia) return false
    if (busca && !q.enunciado.toLowerCase().includes(busca.toLowerCase())) return false
    return true
  })

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Questões de estudo</h1>
      <div className="flex gap-2 flex-wrap mb-3">
        {['Todas', ...MATERIAS].map((m) => (
          <Button key={m} size="sm" variant={materia === m ? 'default' : 'outline'} onClick={() => setMateria(m)}>{m}</Button>
        ))}
      </div>
      <Input placeholder="Buscar no enunciado..." value={busca} onChange={(e) => setBusca(e.target.value)} className="mb-5" />
      <p className="text-sm text-muted-foreground mb-4">{lista.length} questões encontradas. Clique em “Ver resposta” para revelar o gabarito e a explicação.</p>
      <div className="space-y-4">
        {lista.map((q, i) => (
          <Card key={q.id}>
            <CardContent className="pt-5 space-y-3">
              <p className="text-xs text-muted-foreground">{q.materia}</p>
              <p className="font-medium leading-relaxed">{i + 1}. {q.enunciado}</p>
              <ol className="space-y-1 text-sm">
                {q.alternativas.map((alt, idx) => (
                  <li key={idx} className={abertas[q.id] && idx === q.correta ? 'text-emerald-700 font-medium' : ''}>
                    {LETRAS[idx]}. {alt}
                  </li>
                ))}
              </ol>
              {abertas[q.id] ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-sm">
                  <p><strong>Resposta certa: {LETRAS[q.correta]}</strong></p>
                  <p className="text-slate-600 mt-1">{q.explicacao}</p>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setAbertas({ ...abertas, [q.id]: true })}>Ver resposta</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  )
}
