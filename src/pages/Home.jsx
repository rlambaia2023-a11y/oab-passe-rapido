import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MATERIAS, QUESTOES } from '@/data/questoes'
import { estatisticas } from '@/lib/progresso'
import Layout from '@/components/Layout'
import { Play, BookOpen, BarChart3, CheckCircle2 } from 'lucide-react'

export default function Home() {
  const stats = estatisticas()
  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-emerald-800 text-white rounded-2xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">OAB Passe Rápido</h1>
          <p className="mt-2 text-emerald-100 max-w-2xl">
            Revise por matéria, faça simulados e acompanhe seu desempenho.
            Comece agora: são {QUESTOES.length} questões no banco inicial, em {MATERIAS.length} matérias.
          </p>
          <div className="mt-5 flex gap-3 flex-wrap">
            <Link to="/simulado"><Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50"><Play className="w-4 h-4 mr-2" /> Começar simulado</Button></Link>
            <Link to="/questoes"><Button size="lg" variant="outline" className="text-white border-emerald-300 hover:bg-emerald-700 hover:text-white"><BookOpen className="w-4 h-4 mr-2" /> Ver questões</Button></Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{QUESTOES.length}</p><p className="text-sm text-muted-foreground">Questões no banco</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{stats.respondidas}</p><p className="text-sm text-muted-foreground">Respondidas por você</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{stats.percentual}%</p><p className="text-sm text-muted-foreground">De acertos</p></CardContent></Card>
          <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{stats.simulados}</p><p className="text-sm text-muted-foreground">Simulados feitos</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Matérias</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-3">
            {MATERIAS.map((m) => {
              const total = QUESTOES.filter((q) => q.materia === m).length
              const feito = stats.porMateria[m]
              return (
                <Link key={m} to={`/simulado?materia=${encodeURIComponent(m)}`} className="border rounded-xl p-4 hover:bg-slate-50">
                  <p className="font-medium">{m}</p>
                  <p className="text-sm text-muted-foreground">
                    {total} questões
                    {feito?.total ? ` · ${feito.acertos}/${feito.total} certas` : ' · ainda não feita'}
                  </p>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex gap-3 items-start">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5" />
            <p className="text-sm text-slate-600">
              Como usar: faça um simulado por matéria, leia a explicação de cada resposta e volte
              às matérias com menor percentual na página de <Link to="/progresso" className="font-medium underline">Progresso</Link>.
              Para ampliar o banco, edite o arquivo <code>src/data/questoes.js</code> seguindo o mesmo formato.
            </p>
          </CardContent>
        </Card>
        <p className="text-center"><Link to="/progresso" className="text-sm text-slate-600 inline-flex items-center gap-1 underline"><BarChart3 className="w-4 h-4" /> Ver meu progresso</Link></p>
      </div>
    </Layout>
  )
}
