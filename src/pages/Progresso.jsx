import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { estatisticas, lerHistorico, limparProgresso } from '@/lib/progresso'
import Layout from '@/components/Layout'

export default function Progresso() {
  const [stats, setStats] = useState(() => estatisticas())
  const [historico, setHistorico] = useState(() => lerHistorico())

  function limpar() {
    if (!window.confirm('Limpar todo o progresso salvo neste navegador?')) return
    limparProgresso()
    setStats(estatisticas())
    setHistorico([])
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Meu progresso</h1>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{stats.respondidas}</p><p className="text-sm text-muted-foreground">Respondidas</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{stats.percentual}%</p><p className="text-sm text-muted-foreground">Acertos</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{stats.simulados}</p><p className="text-sm text-muted-foreground">Simulados</p></CardContent></Card>
      </div>

      <Card className="mb-5">
        <CardHeader><CardTitle>Por matéria</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(stats.porMateria).map(([m, v]) => (
            <div key={m}>
              <div className="flex justify-between text-sm"><span>{m}</span><span>{v.total ? `${v.acertos}/${v.total} (${Math.round((v.acertos / v.total) * 100)}%)` : 'ainda não feita'}</span></div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-emerald-700" style={{ width: `${v.total ? (v.acertos / v.total) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader><CardTitle>Histórico de simulados</CardTitle></CardHeader>
        <CardContent>
          {historico.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum simulado concluído ainda.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {historico.map((h, i) => (
                <li key={i} className="flex justify-between border-b pb-2">
                  <span>{new Date(h.data).toLocaleString('pt-BR')} · {h.materia}</span>
                  <span className="font-medium">{h.acertos}/{h.total}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Button variant="outline" onClick={limpar}>Limpar progresso deste navegador</Button>
    </Layout>
  )
}
