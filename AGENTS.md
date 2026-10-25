# OAB Passe Rápido

App de estudo para a OAB, adaptado de um export do Base44. Sem SDK do Base44.
Frontend Vite + React + Tailwind + shadcn. Login local opcional (localStorage).
Banco de questões em `src/data/questoes.js` (não são provas oficiais OAB/FGV).
Deploy: Dockerfile + railway.json, serviço estático com fallback SPA em server.mjs.

Nuvem: API em server.mjs (/api/auth, /api/progress), dados em DATA_DIR ou /app/data (volume). Frontend em src/lib/nuvem.js; login tenta nuvem e cai para local se indisponível.
Modo Prova e Revisão: Simulado.jsx (timer, navegação, marcação) e Revisao.jsx (só erros reais).
Nunca repetir (2026-10-25): Simulado.jsx sorteia só questões sem resposta registrada para o usuário (local ou nuvem, com sync da nuvem antes do sorteio); Revisão é a única exceção (só erros). Limpar progresso apaga navegador e nuvem (DELETE /api/progress).
Análise de Provas: página /analise (AnaliseProvas.jsx + src/data/analise-provas.js) — estrutura, mapa de peso, filtros Sempre caem / Só mudam o formato, calculadora de meta e 6 passos para passar. Avisos obrigatórios na página: distribuição não fixa no edital, FGV sem ranking oficial por subtema, sem taxa oficial de aprovação.
Papel do Muse neste projeto (decisão do usuário, 2026-10-25): Engenheiro de IA Aplicada, responsável pela evolução contínua do sistema — melhorar, testar e publicar, sem voltar ao Base44.
