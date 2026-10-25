# OAB Passe Rápido

Simulados e questões de estudo para a OAB, em português. Adaptado de um
export do Base44 (ver `ADAPTACAO.md`): sem SDK do Base44, sem servidor
obrigatório. O estudo funciona no navegador; o progresso fica salvo no
localStorage deste navegador.

## Páginas

- `/` Início — estatísticas, matérias, atalhos
- `/simulado` — simulado por matéria (5, 10, 20 ou todas), nota e revisão com explicação
- `/questoes` — banco com filtro por matéria, busca e gabarito revelável
- `/progresso` — acertos por matéria, histórico de simulados
- `/login`, `/register`, `/forgot-password`, `/reset-password` — conta local (opcional)

## Rodar localmente

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # gera dist/
npm start       # serve dist/ na porta 8080 (ou $PORT)
```

## Banco de questões

`src/data/questoes.js` — 54 questões de revisão em 9 matérias. Para ampliar,
edite esse arquivo seguindo o mesmo formato (id, materia, enunciado,
alternativas, correta, explicacao).

Atenção: estas questões foram elaboradas para revisão de conteúdo. Não são
provas oficiais da OAB/FGV.

## Deploy na Railway

O repositório já vem com `Dockerfile` + `railway.json` (builder Dockerfile).
Na Railway, crie um serviço a partir deste repositório, branch main, e gere
um domínio público. O serviço serve `dist/` com fallback SPA e responde
`/health` com `{"ok": true}`.
