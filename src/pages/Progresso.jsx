import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { estatisticas, lerHistorico, limparProgresso } from '@/lib/progresso'
import { isCloud, limparNuvem, syncProgressFromCloud } from '@/lib/nuvem'
import Layout from '@/components/Layout'

export default function Progresso() {
  const [stats, setStats] = useState(() => estatisticas())
  const [historico, setHistorico] = useState(() => lerHistorico())
  const [nuvemMsg, setNuvemMsg] = useState('')

  // Com conta na nuvem, baixa e mescla o progresso de outros aparelhos.
  useEffect(() => {
    if (!isCloud()) return
    syncProgressFromCloud()
      .then(() => {
        setStats(estatisticas())
        setHistorico(lerHistorico())
        setNuvemMsg('Progresso sincronizado com a nuvem.')
      })
      .catch(() => setNuvemMsg('Não foi possível sincronizar com a nuvem agora. Mostrando o progresso deste navegador.'))
  }, [])

  async function limpar() {
    const naNuvem = isCloud()
    if (!window.confirm(naNuvem
      ? 'Limpar todo o progresso, inclusive na nuvem? Depois disso, as questões voltam a ser inéditas para você.'
      : 'Limpar todo o progresso salvo neste navegador? Depois disso, as questões voltam a ser inéditas para você.')) return
    // Limpar a nuvem primeiro: se só limpasse o navegador, o próximo sync
    // devolveria o histórico antigo e o nunca-repetir voltaria a valer.
    if (naNuvem) {
      try { await limparNuvem() } catch { /* segue limpando o navegador */ }
    }
    limparProgresso()
    setStats(estatisticas())
    setHistorico([])
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-2">Meu progresso</h1>
      {nuvemMsg && <p className="text-sm text-muted-foreground mb-4">{nuvemMsg}</p>}
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
      <Button variant="outline" onClick={limpar}>Limpar todo o progresso{isCloud() ? ' (navegador e nuvem)' : ' deste navegador'}</Button>
      <p className="text-xs text-muted-foreground mt-2">Limpar é a única forma de uma questão voltar a aparecer num simulado novo: sem limpar, questão respondida não se repete.</p>
    </Layout>
  )
}
