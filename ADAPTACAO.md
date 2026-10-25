# OAB Passe Rápido — adaptação fora do Base44

## O que veio no ZIP original (importante)
O ZIP enviado (`oab-passe-rapido-88a23eea.zip`) NÃO continha o app OAB em si:
era só o esqueleto do Base44 — telas de login/cadastro, componentes de UI (shadcn)
e um `App.jsx` sem nenhuma rota, só 404. Não havia páginas, entidades, funções
nem questões. Por isso, "adaptar" aqui não foi só trocar o backend: foi preciso
construir as páginas do OAB sobre esse esqueleto.

Se o seu app OAB de verdade existe no Base44 (com páginas/questões), ele não
estava neste export. Nesse caso, publique o app no Base44 e exporte de novo
(via sync GitHub ou novo ZIP) que eu importo o conteúdo real para cá.

## O que foi feito
- Removido o SDK e o plugin do Base44 (`@base44/sdk`, `@base44/vite-plugin`).
- `vite.config.js` agora declara o alias `@/` (antes era o plugin do Base44).
- `src/api/base44Client.js` virou um shim local: mantém o mesmo nome/import
  usado pelas telas antigas, mas login/cadastro/senha funcionam em localStorage,
  sem servidor e sem Google/OTP. Login NÃO é obrigatório para estudar.
- Páginas novas, em pt-BR:
  - `/` Início — estatísticas, matérias, atalhos
  - `/simulado` — simulado por matéria, 5/10/20/todas, nota e revisão com explicação
  - `/questoes` — banco com filtro por matéria, busca e gabarito revelável
  - `/progresso` — acertos por matéria, histórico de simulados, limpar progresso
  - `/login`, `/register`, `/forgot-password`, `/reset-password` — conta local
- Banco após ampliação: 54 questões de revisão em 9 matérias, em `src/data/questoes.js`.
  NÃO são provas oficiais da OAB/FGV. Para ampliar, edite esse arquivo no mesmo formato.

## Rodar
```bash
cd oab-passe-rapido
npm install
npm run dev   # http://localhost:5173
npm run build # gera dist/ (site estático, dá para publicar na Vercel/Railway)
```

## Limites do modo local
- Progresso e contas ficam só neste navegador (localStorage). Trocar de
  navegador/computador = começar de novo.
- Não é login seguro multiusuário. Para publicar para outras pessoas com
  contas de verdade, o próximo passo é um backend (Node + SQLite/Postgres)
  ou importar o conteúdo real do Base44.

## Novidades (2026-10-25)
- **Progresso na nuvem**: `server.mjs` agora tem API `/api/auth/*` e `/api/progress`
  (contas com senha em scrypt + token, dados em JSON em DATA_DIR).
  Login/cadastro tentam a nuvem primeiro e caem para conta local se a API não
  estiver disponível. Sem volume na Railway, os dados somem a cada redeploy;
  com volume montado em `/app/data`, o servidor usa esse diretório sozinho.
- **Modo Prova**: no Simulado, escolha Prova (timer, navegação livre, marcar
  para revisar, finalização automática no fim do tempo, sem gabarito durante).
- **Revisão de erros real** (`/revisao`): só questões que você realmente errou;
  acertou na revisão, sai da lista. O último simulado/prova deixa seus erros
  prontos para refazer.
- **Visual e celular**: menu hamburger no mobile, hero em gradiente, botões
  com altura mínima de toque, alternativas maiores e timer fixo na prova.
