import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CRUZAMENTO_POR_EDICAO, FONTES_CRUZAMENTO, FREQUENCIA, NAO_AFIRMAR, PADRAO_GERAL, PADROES_FGV, PROVAVEIS } from '@/data/cruzamento-provas'
import Layout from '@/components/Layout'

const NIVEL_LABEL = {
  'quase sempre': 'Quase sempre',
  frequente: 'Frequente',
  'bloco menor': 'Bloco menor (2 no padrão)',
  'muito provavel': 'Muito provável',
  provavel: 'Provável',
  atencao: 'De atenção',
}

export default function CruzamentoProvas() {
  const [freq, setFreq] = useState('todos')
  const [prov, setProv] = useState('todos')
  const [busca, setBusca] = useState('')

  const freqFiltrada = useMemo(() => FREQUENCIA.filter((f) => {
    if (freq !== 'todos' && f.nivel !== freq) return false
    if (busca && !(f.materia + f.temas).toLowerCase().includes(busca.toLowerCase())) return false
    return true
  }), [freq, busca])
  const provFiltrada = useMemo(() => PROVAVEIS.filter((p) => {
    if (prov !== 'todos' && p.nivel !== prov) return false
    if (busca && !(p.materia + p.temas).toLowerCase().includes(busca.toLowerCase())) return false
    return true
  }), [prov, busca])

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-2">Cruzamento de todas as provas</h1>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        Cruzamento das provas já aplicadas da 1ª fase do Exame de Ordem (FGV): matérias cobradas,
        temas mais cobrados e as prováveis da próxima edição. As questões do nosso banco são de
        revisão e não são provas oficiais da OAB/FGV, e nenhum enunciado oficial é reproduzido aqui.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm mb-5 leading-relaxed">
        <strong>O aviso mais importante desta página:</strong> não existe, em fonte pública encontrada,
        tabela completa edição por edição, do 38º ao 47º, de questões por matéria, nem contagem exata
        por subtema por edição. Abaixo vai só o que foi confirmado por edição, e o resto como padrão
        geral e frequência qualitativa. Uma tabela preenchida para todas as edições seria inventar dados.
      </div>

      <Card className="mb-5">
        <CardHeader><CardTitle>Cruzamento por edição: só o confirmado</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {CRUZAMENTO_POR_EDICAO.map((c) => (
            <div key={c.edicao} className="border rounded-xl p-4 space-y-1">
              <p className="font-medium">{c.edicao}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{c.dado}</p>
              <p className="text-xs text-muted-foreground">{c.fonte}</p>
            </div>
          ))}
          <p className="text-sm text-muted-foreground">Próxima edição tratada nas fontes: a 48ª. A 1ª fase estava marcada, segundo o Estratégia OAB de outubro de 2026, para 10 de janeiro de 2027 — confira o edital vigente, pois a data pode mudar.</p>
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader><CardTitle>Padrão geral: onde as fontes concordam e onde divergem</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {PADRAO_GERAL.map((p) => (
            <div key={p.padrao} className="border rounded-xl p-4 space-y-1">
              <p className="font-medium">{p.padrao}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{p.texto}</p>
            </div>
          ))}
          <p className="text-sm text-muted-foreground">O edital não fixa número por matéria. A única cota citada é conjunta: no mínimo 15% da prova, em conjunto, sobre Estatuto, Regulamento Geral, Código de Ética e Direitos Humanos.</p>
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader><CardTitle>Temas mais cobrados, por frequência observada</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant={freq === 'todos' ? 'default' : 'outline'} onClick={() => setFreq('todos')}>Todos ({FREQUENCIA.length})</Button>
            <Button size="sm" variant={freq === 'quase sempre' ? 'default' : 'outline'} onClick={() => setFreq('quase sempre')}>Quase sempre</Button>
            <Button size="sm" variant={freq === 'frequente' ? 'default' : 'outline'} onClick={() => setFreq('frequente')}>Frequentes</Button>
            <Button size="sm" variant={freq === 'bloco menor' ? 'default' : 'outline'} onClick={() => setFreq('bloco menor')}>Bloco menor</Button>
          </div>
          <Input placeholder="Buscar matéria ou tema..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          <p className="text-sm text-muted-foreground">{freqFiltrada.length} matérias encontradas. “Quase sempre” é o tema apontado como recorrente por mais de uma fonte; “bloco menor” é a matéria de 2 questões no padrão.</p>
          <div className="space-y-4">
            {freqFiltrada.map((f) => (
              <div key={f.materia} className="border rounded-xl p-4 space-y-1">
                <p className="text-xs text-muted-foreground">{NIVEL_LABEL[f.nivel]}</p>
                <p className="font-medium">{f.materia}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{f.temas}</p>
              </div>
            ))}
            {freqFiltrada.length === 0 && <p className="text-sm text-muted-foreground">Nenhum tema com essa busca.</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader><CardTitle>Prováveis da próxima edição (OAB 48)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm leading-relaxed">
            <strong>“Provável” aqui é inferência por recorrência, não garantia e não vazamento de prova.</strong> A FGV não divulga previamente a distribuição nem os temas da próxima edição.
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant={prov === 'todos' ? 'default' : 'outline'} onClick={() => setProv('todos')}>Todos ({PROVAVEIS.length})</Button>
            <Button size="sm" variant={prov === 'muito provavel' ? 'default' : 'outline'} onClick={() => setProv('muito provavel')}>Muito prováveis</Button>
            <Button size="sm" variant={prov === 'provavel' ? 'default' : 'outline'} onClick={() => setProv('provavel')}>Prováveis</Button>
            <Button size="sm" variant={prov === 'atencao' ? 'default' : 'outline'} onClick={() => setProv('atencao')}>De atenção</Button>
          </div>
          <div className="space-y-4">
            {provFiltrada.map((p, i) => (
              <div key={i} className="border rounded-xl p-4 space-y-1">
                <p className="text-xs text-muted-foreground">{NIVEL_LABEL[p.nivel]}</p>
                <p className="font-medium">{p.materia}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{p.temas}</p>
              </div>
            ))}
            {provFiltrada.length === 0 && <p className="text-sm text-muted-foreground">Nenhum tema com esse filtro e busca.</p>}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/simulado"><Button>Treinar com questões inéditas</Button></Link>
            <Link to="/analise"><Button variant="outline">Ver Análise de Provas</Button></Link>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader><CardTitle>Como a FGV cobra o que mais cai</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {PADROES_FGV.map((p) => (
            <div key={p.titulo} className="border rounded-xl p-4 space-y-1">
              <p className="font-medium">{p.titulo}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{p.texto}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader><CardTitle>O que esta página não afirma</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-600">
            {NAO_AFIRMAR.map((n) => <li key={n}>• {n}</li>)}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Fontes do cruzamento</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {FONTES_CRUZAMENTO.map((f) => (
              <li key={f.url}><a href={f.url} target="_blank" rel="noreferrer" className="underline text-emerald-800">{f.nome}</a></li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground mt-3">Frequências são qualitativas porque as fontes declaram “diversas provas anteriores” sem listar edições, ou não declaram período. Onde a fonte dá número pontual, ele aparece com a edição e a fonte.</p>
        </CardContent>
      </Card>
    </Layout>
  )
}
