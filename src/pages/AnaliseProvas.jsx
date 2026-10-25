import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { QUESTOES } from '@/data/questoes'
import { estatisticas } from '@/lib/progresso'
import { DISTRIBUICAO, ESTRUTURA, FONTES, PASSOS_PARA_PASSAR, TEMAS } from '@/data/analise-provas'
import Layout from '@/components/Layout'

export default function AnaliseProvas() {
  const [filtro, setFiltro] = useState('todos')
  const [busca, setBusca] = useState('')
  const [bloco, setBloco] = useState('Todos')
  const [acertosSimulado, setAcertosSimulado] = useState('')
  const stats = estatisticas()
  const ineditas = Math.max(0, QUESTOES.length - stats.respondidas)

  const temasFiltrados = useMemo(() => {
    return TEMAS.filter((t) => {
      if (filtro === 'sempre' && t.tipo !== 'sempre') return false
      if (filtro === 'formato' && t.tipo !== 'formato') return false
      if (busca) {
        const q = busca.toLowerCase()
        if (!(t.tema + t.materia + t.comoCai).toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [filtro, busca])

  const distribuicaoFiltrada = bloco === 'Todos' ? DISTRIBUICAO : DISTRIBUICAO.filter((d) => d.bloco === bloco)
  const acertosNum = Math.max(0, Math.min(80, parseInt(acertosSimulado, 10) || 0))
  const faltam = Math.max(0, ESTRUTURA.acertosParaPassar - acertosNum)

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-2">Análise de Provas: como passar</h1>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        Análise das provas já aplicadas da 1ª fase do Exame de Ordem (FGV), com o filtro do que
        sempre se repete e do que só muda de formato, mais o sistema para passar. As questões do
        nosso banco são de revisão e não são provas oficiais da OAB/FGV.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm mb-5 leading-relaxed">
        <strong>Leia isto antes de usar:</strong> a FGV não publica ranking oficial por subtema e o
        edital não fixa quantas questões cada matéria terá. Os números e temas abaixo são o padrão
        observado nos exames recentes, segundo levantamentos de cursinhos — um mapa de prioridade,
        não uma garantia de que o tema cairá na próxima edição. Confira o edital da edição em curso.
        Não foi localizada taxa oficial de aprovação em fonte primária, por isso nenhum percentual
        de aprovação é apresentado aqui.
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{ESTRUTURA.questoes}</p><p className="text-sm text-muted-foreground">Questões objetivas</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{ESTRUTURA.acertosParaPassar}</p><p className="text-sm text-muted-foreground">Acertos para passar (50%)</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{ESTRUTURA.horas}h</p><p className="text-sm text-muted-foreground">De prova, sem consulta</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{ESTRUTURA.minutosPorQuestao}</p><p className="text-sm text-muted-foreground">Por questão, em média</p></CardContent></Card>
      </div>

      <Card className="mb-5">
        <CardContent className="pt-5 text-sm leading-relaxed space-y-1">
          <p><strong>Nota:</strong> cada questão vale 1 ponto e a nota é o número de acertos. Errar não desconta ponto de outra questão, por isso não deixe questão em branco.</p>
          <p><strong>Cota conjunta:</strong> {ESTRUTURA.cotaConjunta}</p>
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader><CardTitle>Seu ponto de partida aqui no sistema</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>Você já respondeu {stats.respondidas} de {QUESTOES.length} questões do banco, com {stats.percentual}% de acertos. Restam {ineditas} inéditas para você — e o simulado nunca repete questão já respondida.</p>
          <div className="flex gap-2 flex-wrap">
            <Link to="/simulado"><Button>Simulado só com inéditas</Button></Link>
            <Link to="/revisao"><Button variant="outline">Revisar meus erros</Button></Link>
            <Link to="/progresso"><Button variant="outline">Ver progresso</Button></Link>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader><CardTitle>Calculadora da meta: quantos pontos faltam?</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Digite quantos acertos você faria numa prova de 80 questões.</p>
          <div className="flex gap-2 flex-wrap items-center">
            <Input
              type="number" min="0" max="80" inputMode="numeric" className="max-w-[140px]"
              placeholder="Ex.: 32" value={acertosSimulado}
              onChange={(e) => setAcertosSimulado(e.target.value)}
            />
            <span className="text-sm">acertos em 80</span>
          </div>
          {acertosSimulado !== '' && (
            <p className="text-sm leading-relaxed">
              {faltam === 0
                ? `Com ${acertosNum} acertos você já atinge o corte de 40. O trabalho agora é manter: revise os erros e faça simulados com tempo.`
                : `Faltam ${faltam} pontos para o corte de 40. O caminho mais curto é o núcleo pesado (38 questões) e depois as matérias de 2 questões, que somam 18 pontos.`}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader><CardTitle>Mapa de peso: onde estão os pontos</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['Todos', 'Núcleo pesado', 'Intermediário', 'Bloco das 2 questões'].map((b) => (
              <Button key={b} size="sm" variant={bloco === b ? 'default' : 'outline'} onClick={() => setBloco(b)}>{b}</Button>
            ))}
          </div>
          <div className="space-y-3">
            {distribuicaoFiltrada.map((d) => (
              <div key={d.materia}>
                <div className="flex justify-between text-sm"><span>{d.materia}</span><span className="text-muted-foreground">{d.questoes} questões · {d.bloco}</span></div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-700" style={{ width: `${(d.questoes / 80) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Núcleo pesado: 38 questões (47,5%). Intermediário: 24 (30%). Bloco das 2 questões: 18 (22,5%). Total: 80.</p>
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader><CardTitle>Filtro: o que sempre cai e o que só muda de formato</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant={filtro === 'todos' ? 'default' : 'outline'} onClick={() => setFiltro('todos')}>Todos ({TEMAS.length})</Button>
            <Button size="sm" variant={filtro === 'sempre' ? 'default' : 'outline'} onClick={() => setFiltro('sempre')}>Sempre caem ({TEMAS.filter((t) => t.tipo === 'sempre').length})</Button>
            <Button size="sm" variant={filtro === 'formato' ? 'default' : 'outline'} onClick={() => setFiltro('formato')}>Só mudam o formato ({TEMAS.filter((t) => t.tipo === 'formato').length})</Button>
          </div>
          <Input placeholder="Buscar tema, matéria ou palavra-chave..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          <p className="text-sm text-muted-foreground">{temasFiltrados.length} temas encontrados. “Sempre cai” é o assunto que se repete; “só muda o formato” é a regra que é a mesma e só troca o caso do enunciado.</p>
          <div className="space-y-4">
            {temasFiltrados.map((t, i) => (
              <div key={i} className="border rounded-xl p-4 space-y-1">
                <p className="text-xs text-muted-foreground">{t.materia} · {t.tipo === 'sempre' ? 'Sempre cai' : 'Só muda o formato'}</p>
                <p className="font-medium leading-relaxed">{t.tema}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{t.comoCai}</p>
                <p className="text-sm"><strong>Como estudar:</strong> {t.dica}</p>
                {t.banco && <Link to={`/simulado?materia=${encodeURIComponent(t.banco)}`} className="text-sm font-medium underline text-emerald-800">Treinar {t.banco} com questões inéditas</Link>}
              </div>
            ))}
            {temasFiltrados.length === 0 && <p className="text-sm text-muted-foreground">Nenhum tema com essa busca. Limpe o filtro e tente outra palavra.</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader><CardTitle>Sistema para passar: 6 passos</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {PASSOS_PARA_PASSAR.map((p) => (
            <div key={p.titulo} className="border rounded-xl p-4 space-y-1">
              <p className="font-medium">{p.titulo}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{p.texto}</p>
              <Link to={p.acao} className="text-sm font-medium underline text-emerald-800">{p.acaoTexto}</Link>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Fontes da análise</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {FONTES.map((f) => (
              <li key={f.url}><a href={f.url} target="_blank" rel="noreferrer" className="underline text-emerald-800">{f.nome}</a></li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground mt-3">Os exemplos de formato são ilustrações pedagógicas do padrão da banca, não reproduzem questões oficiais. A regra de “não zerar nenhuma área” apareceu numa página secundária, mas não foi confirmada nos trechos de edital consultados, por isso não é apresentada aqui como regra.</p>
        </CardContent>
      </Card>
    </Layout>
  )
}
