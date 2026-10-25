// Cruzamento das provas já aplicadas da 1ª fase do Exame de Ordem (FGV).
// REGRA DESTE ARQUIVO: só entra aqui o que a pesquisa confirmou em fonte.
// Não existe, em fonte pública encontrada, tabela completa edição por edição
// (38º ao 47º) de questões por matéria, nem contagem exata por subtema por
// edição. Frequência é qualitativa: quase sempre / frequente / bloco menor.
// "Provável" para a próxima edição (48ª) é inferência por recorrência,
// não garantia e não vazamento de prova. Nenhum enunciado oficial é copiado.
export const CRUZAMENTO_POR_EDICAO = [
  { edicao: '40º Exame', dado: 'Direito Constitucional: 7 questões.', fonte: 'Estratégia OAB, temas de Constitucional para a OAB 48 (23/10/2026)' },
  { edicao: '41º Exame', dado: 'Direito Constitucional: 7 questões.', fonte: 'Estratégia OAB, temas de Constitucional para a OAB 48 (23/10/2026)' },
  { edicao: '46º Exame', dado: 'Direito Constitucional: 8 questões. ECA: ato infracional (exemplo citado, sem número da questão).', fonte: 'Estratégia OAB, Constitucional (23/10/2026) e matérias de menor incidência (21/10/2026)' },
  { edicao: '47º Exame', dado: 'ECA: questão 43, convivência familiar de criança acolhida; questão 44, medida socioeducativa. Constitucional: extradição de brasileiro naturalizado, medida provisória criando inelegibilidade, iniciativa para criação de Varas, recepção de normas pré-1988 e intervenção estadual em Município por educação.', fonte: 'Estratégia OAB, Constitucional (23/10/2026) e matérias de menor incidência (21/10/2026)' },
  { edicao: '38º, 39º, 42º, 43º, 44º e 45º', dado: 'Nenhum número por matéria confirmado nas fontes abertas desta pesquisa.', fonte: '—' },
]

export const PADRAO_GERAL = [
  { padrao: 'Padrão A — Aprovado na Ordem (11/06/2026, sem período declarado)', texto: 'Ética 8; Civil, Constitucional, Penal, Processo Civil e Processo Penal com 6 cada; Tributário, Administrativo, Trabalho e Processo do Trabalho com 5 cada; Empresarial 4; 11 matérias com 2 cada. ATENÇÃO: as parcelas somam 84, acima das 80 questões da prova, e o texto fala em 20 disciplinas mas lista 22 rótulos. Não pode ser lido como distribuição exata de nenhuma edição.' },
  { padrao: 'Padrão B — Estratégia OAB, menor incidência (21/10/2026, referência para a OAB 48)', texto: '9 matérias com 2 questões cada, somando 18 pontos (22,5%): ECA, Consumidor, Ambiental, Direitos Humanos, Internacional, Filosofia do Direito, Previdenciário, Financeiro e Eleitoral. A própria fonte avisa que não é divisão garantida pelo edital.' },
  { padrao: 'Mudança confirmada com número', texto: 'A única variação confirmada com número foi Direito Constitucional: 7 questões no 40º e no 41º, 8 no 46º. Eleitoral, Financeiro e Previdenciário já figuram no bloco de 2 questões no padrão atual descrito pelos cursinhos, mas a data de entrada deles no conteúdo programático não foi confirmada em fonte primária e não deve ser datada aqui.' },
]

export const FREQUENCIA = [
  { nivel: 'quase sempre', materia: 'Ética Profissional', temas: 'Prerrogativas (art. 7º do Estatuto), inscrição, honorários, infrações e sanções, publicidade, sigilo, sociedade de advogados, processo disciplinar, incompatibilidade contra impedimento.' },
  { nivel: 'quase sempre', materia: 'Direito Constitucional', temas: 'Controle de constitucionalidade (ADI, ADC, ADPF, ADO, difuso contra concentrado, legitimados), direitos fundamentais (art. 5º), remédios constitucionais, organização dos Poderes, nacionalidade e direitos políticos.' },
  { nivel: 'quase sempre', materia: 'Direito Civil', temas: 'Contratos e obrigações, Direito das Coisas (posse contra propriedade), responsabilidade civil, Família, Sucessões, prescrição contra decadência.' },
  { nivel: 'quase sempre', materia: 'Direito Processual Civil', temas: 'Recursos (apelação, agravo de instrumento, embargos de declaração), prazos de 15 e 5 dias e efeitos, petição inicial, execução e cumprimento de sentença.' },
  { nivel: 'quase sempre', materia: 'Direito Penal', temas: 'Teoria do crime, tipicidade, concurso de crimes, crime consumado contra tentativa, extinção da punibilidade, crimes contra a vida e contra o patrimônio.' },
  { nivel: 'quase sempre', materia: 'Direito Processual Penal', temas: 'Ação penal, provas, recursos (inclusive recurso em sentido estrito), prisão e liberdade provisória, competência, pronúncia, impronúncia e absolvição sumária.' },
  { nivel: 'frequente', materia: 'Direito Administrativo', temas: 'Organização administrativa, agentes públicos, serviços públicos, improbidade administrativa, licitações e contratos pela Lei 14.133/2021 (modalidades, dispensa, inexigibilidade).' },
  { nivel: 'frequente', materia: 'Direito Tributário', temas: 'Competência tributária, fato gerador, imposto contra taxa contra contribuição, limitações do poder de tributar, extinção do crédito tributário.' },
  { nivel: 'frequente', materia: 'Direito Empresarial', temas: 'Sociedades (limitada contra anônima, simples contra empresária), responsabilidade dos sócios, empresário individual.' },
  { nivel: 'frequente', materia: 'Direito do Trabalho', temas: 'Contrato de trabalho, requisitos da relação de emprego (pessoalidade, onerosidade, habitualidade, subordinação), remuneração, extinção do contrato, direito coletivo.' },
  { nivel: 'frequente', materia: 'Direito Processual do Trabalho', temas: 'Audiência trabalhista, execução, procedimentos especiais, recurso ordinário e recurso de revista.' },
  { nivel: 'bloco menor', materia: 'Direitos Humanos', temas: 'Sistema interamericano, sobretudo o Pacto de São José da Costa Rica. Sem outros subtemas detalhados nas fontes abertas.' },
  { nivel: 'bloco menor', materia: 'Direito do Consumidor', temas: 'Responsabilidade civil objetiva do fornecedor, direitos básicos do consumidor, práticas abusivas.' },
  { nivel: 'bloco menor', materia: 'ECA', temas: 'Ato infracional, medida socioeducativa, convivência familiar, direitos fundamentais da criança e do adolescente, política de atendimento.' },
  { nivel: 'bloco menor', materia: 'Direito Ambiental', temas: 'Licenciamento ambiental: licença prévia, de instalação e de operação.' },
  { nivel: 'bloco menor', materia: 'Direito Previdenciário', temas: 'Benefícios: aposentadoria, auxílios, pensão por morte, salário-maternidade.' },
  { nivel: 'bloco menor', materia: 'Direito Internacional', temas: 'Sem subtemas detalhados nas fontes abertas. A página não inventa lista para esta matéria.' },
  { nivel: 'bloco menor', materia: 'Filosofia do Direito', temas: 'Sem subtemas detalhados nas fontes abertas. A página não inventa lista para esta matéria.' },
  { nivel: 'bloco menor', materia: 'Direito Eleitoral', temas: 'Sem subtemas detalhados nas fontes abertas. Não contar como questão de Eleitoral o exemplo do 47º sobre medida provisória e inelegibilidade, que foi cobrado dentro de Constitucional.' },
  { nivel: 'bloco menor', materia: 'Direito Financeiro', temas: 'Sem subtemas detalhados nas fontes abertas, além de menção vaga a novas emendas constitucionais.' },
]

export const PROVAVEIS = [
  { nivel: 'muito provavel', materia: 'Ética Profissional', temas: 'Prerrogativas, infrações e sanções, honorários, publicidade, sigilo, inscrição, incompatibilidade contra impedimento.' },
  { nivel: 'muito provavel', materia: 'Direito Constitucional', temas: 'Controle de constitucionalidade, direitos fundamentais, remédios constitucionais e suas diferenças.' },
  { nivel: 'muito provavel', materia: 'Direito Civil', temas: 'Contratos e obrigações, responsabilidade civil, prescrição contra decadência.' },
  { nivel: 'muito provavel', materia: 'Direito Processual Civil', temas: 'Recursos (apelação, agravo de instrumento, embargos de declaração, prazos e efeitos).' },
  { nivel: 'muito provavel', materia: 'Direito Penal', temas: 'Teoria do crime, tipicidade, concurso de crimes, consumação contra tentativa, extinção da punibilidade.' },
  { nivel: 'muito provavel', materia: 'Direito Processual Penal', temas: 'Ação penal, provas, recursos, prisão e liberdade provisória, competência.' },
  { nivel: 'muito provavel', materia: 'Direito do Trabalho e Processo do Trabalho', temas: 'Contrato de trabalho e requisitos da relação de emprego; recurso ordinário e recurso de revista.' },
  { nivel: 'provavel', materia: 'Direito Administrativo', temas: 'Organização administrativa, agentes públicos, serviços públicos, improbidade, licitações pela Lei 14.133/2021.' },
  { nivel: 'provavel', materia: 'Direito Tributário', temas: 'Competência, fato gerador, imposto contra taxa contra contribuição, limitações do poder de tributar, extinção do crédito.' },
  { nivel: 'provavel', materia: 'Direito Empresarial', temas: 'Limitada contra anônima, simples contra empresária, responsabilidade dos sócios.' },
  { nivel: 'provavel', materia: 'Direito Civil e Processo Civil (complementos)', temas: 'Petição inicial, execução e cumprimento de sentença, Família e Sucessões.' },
  { nivel: 'provavel', materia: 'Direito Constitucional (complementos)', temas: 'Organização dos Poderes, processo legislativo, organização do Estado, nacionalidade e direitos políticos.' },
  { nivel: 'atencao', materia: 'ECA', temas: 'Ato infracional e medidas socioeducativas: apareceu no 46º e no 47º seguidos, segundo o Estratégia OAB.' },
  { nivel: 'atencao', materia: 'Reforma tributária (EC 132/2023)', temas: 'IBS, CBS, Imposto Seletivo e transição. Mudança legislativa real, já presente em materiais de estudo, mas NÃO confirmada como cobrança na 1ª fase do 47º. Acompanhe como tema legislativo, não como tema já recorrente.' },
  { nivel: 'atencao', materia: 'Eleitoral, Financeiro e Previdenciário', temas: 'Bloco de 2 questões no padrão. Qualquer variação muda pouco o total, mas pode decidir quem está perto dos 40 pontos. Em Previdenciário, o recorte mais citado é o de benefícios.' },
  { nivel: 'atencao', materia: 'Ambiental, Consumidor e Direitos Humanos', temas: 'Um subtema estável cada: licenciamento, responsabilidade objetiva do fornecedor e sistema interamericano (Pacto de São José). Com 2 questões no padrão, um subtema bem estudado pode render a questão da matéria.' },
  { nivel: 'atencao', materia: 'Ética — publicidade em redes sociais', temas: 'Provimento 205/2021 e marketing jurídico: relevância crescente apontada pelo Estratégia OAB, dentro de uma matéria já muito provável.' },
]

export const PADROES_FGV = [
  { titulo: 'Mini-casos e situações práticas', texto: 'A banca apresenta um caso concreto para o candidato identificar a regra e sua eventual exceção. Não basta memorizar o dispositivo.' },
  { titulo: 'Alternativas que diferem num detalhe', texto: 'Boa parte das alternativas pode reproduzir uma regra verdadeira; o erro está no detalhe que muda o sentido: prazo, legitimado, cabimento ou efeito. Pares clássicos: prescrição contra decadência, controle difuso contra concentrado, consumação contra tentativa, honorários sucumbenciais contra contratuais, suspensão contra exclusão contra cancelamento.' },
  { titulo: 'Regra geral contra exceção', texto: 'Estudar só a regra, sem a exceção, é o erro mais apontado: sigilo e suas exceções, prerrogativas e seus limites, pronúncia contra impronúncia contra absolvição sumária.' },
  { titulo: 'Lei seca como base', texto: 'Em Ética e nas matérias do bloco menor, o estudo direto do Estatuto, do Regulamento Geral, do Código de Ética, da Constituição e dos códigos é a estratégia indicada pelas fontes.' },
  { titulo: 'Recursos como eixo dos processos', texto: 'Em Processo Civil, Processo Penal e Processo do Trabalho, a banca testa cabimento, prazo e efeito dos recursos — e, em Processo Penal, a diferença em relação ao CPC.' },
  { titulo: 'Sobre “matéria nova = questão literal”: não confirmado', texto: 'Nenhuma fonte aberta afirmou que Eleitoral, Financeiro ou Previdenciário sejam cobrados de forma mais literal que as demais. A página não afirma isso.' },
]

export const NAO_AFIRMAR = [
  'Ranking oficial da FGV por subtema — não localizado no portal da FGV.',
  'Contagem exata por subtema por edição (por exemplo, quantas vezes um tema caiu no 45º).',
  'Distribuição exata por matéria em cada edição de 38 a 47, ou na próxima edição (48ª).',
  'Data de entrada de Eleitoral, Financeiro e Previdenciário no conteúdo programático.',
  'Taxa oficial de aprovação, geral ou da 1ª fase, por edição.',
  'Que a reforma tributária (EC 132/2023) já foi cobrada na 1ª fase do 47º.',
  'Subtemas específicos de Internacional, Filosofia do Direito, Eleitoral e Financeiro.',
  'Ausência de um tema em edições recentes, sem checagem questão por questão nos cadernos oficiais.',
]

export const FONTES_CRUZAMENTO = [
  { nome: 'Estratégia OAB — OAB 48: temas de Direito Constitucional mais cobrados pela FGV', url: 'https://oab.estrategia.com/portal/oab-48-temas-direito-constitucional-cobrados-fgv/' },
  { nome: 'Estratégia OAB — Ética na OAB 48: quais assuntos priorizar', url: 'https://oab.estrategia.com/portal/etica-oab-48-assuntos-priorizar-aprovacao/' },
  { nome: 'Estratégia OAB — Como estudar matérias de menor incidência na prova da OAB 48', url: 'https://oab.estrategia.com/portal/oab-48-como-estudar-materias-menor-incidencia/' },
  { nome: 'Aprovado na Ordem — Ranking das disciplinas que mais caem na 1ª fase da OAB', url: 'https://aprovadonaordem.com.br/assuntos-que-mais-caem-na-oab-1-fase-ranking-disciplinas/' },
  { nome: 'Ceisc — Assuntos mais cobrados na 1ª fase da OAB', url: 'https://ceisc.com.br/blog/post/os-assuntos-mais-cobrados-na-1a-fase-oab' },
  { nome: 'Estratégia OAB — Os temas que mais caem na primeira fase da OAB', url: 'https://oab.estrategia.com/portal/temas-mais-caem-primeira-fase-oab/' },
  { nome: 'Gran OAB — Artigos mais cobrados na OAB por matéria', url: 'https://oab.grancursosonline.com.br/blog/artigos-mais-cobrados-oab/' },
  { nome: 'FGV Conhecimento — Exame de Ordem da OAB (portal oficial)', url: 'https://oab.fgv.br/' },
]
