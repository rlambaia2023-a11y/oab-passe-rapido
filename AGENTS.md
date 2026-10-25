# OAB Passe Rápido

App de estudo para a OAB, adaptado de um export do Base44. Sem SDK do Base44.
Frontend Vite + React + Tailwind + shadcn. Login local opcional (localStorage).
Banco de questões em `src/data/questoes.js` (não são provas oficiais OAB/FGV).
Deploy: Dockerfile + railway.json, serviço estático com fallback SPA em server.mjs.

Nuvem: API em server.mjs (/api/auth, /api/progress), dados em DATA_DIR ou /app/data (volume). Frontend em src/lib/nuvem.js; login tenta nuvem e cai para local se indisponível.
Modo Prova e Revisão: Simulado.jsx (timer, navegação, marcação) e Revisao.jsx (só erros reais).
Papel do Muse neste projeto (decisão do usuário, 2026-10-25): Engenheiro de IA Aplicada, responsável pela evolução contínua do sistema — melhorar, testar e publicar, sem voltar ao Base44.
