// Análise da 1ª fase do Exame de Ordem (FGV) a partir de provas já aplicadas.
// ATENÇÃO, LEIA ANTES DE USAR: a FGV não publica ranking oficial por subtema
// e o edital não fixa quantas questões cada matéria terá. Os números abaixo
// são o padrão observado nos exames recentes, segundo levantamentos de
// cursinhos (fontes no fim do arquivo) — mapa de prioridade, não garantia
// de que o tema cairá na próxima edição. As questões do nosso banco são
// de revisão, não são provas oficiais da OAB/FGV.
export const ESTRUTURA = {
  questoes: 80,
  horas: 5,
  acertosParaPassar: 40,
  alternativas: 4,
  minutosPorQuestao: '3min45s',
  descontoPorErro: false,
  cotaConjunta: 'No mínimo 15% das questões, em conjunto, sobre Estatuto da OAB, Regulamento Geral, Código de Ética, Direitos Humanos e Filosofia do Direito. É cota da prova, não mínimo por candidato em cada matéria.',
}

export const DISTRIBUICAO = [
  { materia: 'Ética Profissional', questoes: 8, bloco: 'Núcleo pesado' },
  { materia: 'Direito Constitucional', questoes: 6, bloco: 'Núcleo pesado' },
  { materia: 'Direito Civil', questoes: 6, bloco: 'Núcleo pesado' },
  { materia: 'Direito Processual Civil', questoes: 6, bloco: 'Núcleo pesado' },
  { materia: 'Direito Penal', questoes: 6, bloco: 'Núcleo pesado' },
  { materia: 'Direito Processual Penal', questoes: 6, bloco: 'Núcleo pesado' },
  { materia: 'Direito Administrativo', questoes: 5, bloco: 'Intermediário' },
  { materia: 'Direito Tributário', questoes: 5, bloco: 'Intermediário' },
  { materia: 'Direito do Trabalho', questoes: 5, bloco: 'Intermediário' },
  { materia: 'Direito Processual do Trabalho', questoes: 5, bloco: 'Intermediário' },
  { materia: 'Direito Empresarial', questoes: 4, bloco: 'Intermediário' },
  { materia: 'Direitos Humanos', questoes: 2, bloco: 'Bloco das 2 questões' },
  { materia: 'Direito do Consumidor', questoes: 2, bloco: 'Bloco das 2 questões' },
  { materia: 'ECA', questoes: 2, bloco: 'Bloco das 2 questões' },
  { materia: 'Direito Ambiental', questoes: 2, bloco: 'Bloco das 2 questões' },
  { materia: 'Direito Internacional', questoes: 2, bloco: 'Bloco das 2 questões' },
  { materia: 'Filosofia do Direito', questoes: 2, bloco: 'Bloco das 2 questões' },
  { materia: 'Direito Eleitoral', questoes: 2, bloco: 'Bloco das 2 questões' },
  { materia: 'Direito Financeiro', questoes: 2, bloco: 'Bloco das 2 questões' },
  { materia: 'Direito Previdenciário', questoes: 2, bloco: 'Bloco das 2 questões' },
]

// tipo: 'sempre' = tema que se repete em praticamente todas as edições;
// 'formato' = a regra é a mesma, só muda o caso do enunciado.
// banco: matéria correspondente no nosso banco de questões, ou null quando
// o nosso banco ainda não tem essa matéria.
export const TEMAS = [
  { tipo: 'sempre', materia: 'Ética Profissional', tema: 'Honorários advocatícios', comoCai: 'Quanto o advogado pode cobrar, honorários de sucumbência e arbitramento.', dica: 'Decore a lógica do art. 22 do Estatuto, não só o número do artigo.', banco: 'Ética Profissional' },
  { tipo: 'sempre', materia: 'Ética Profissional', tema: 'Prerrogativas, infrações e penalidades', comoCai: 'Mini-caso sobre conduta do advogado: o que ele pode, o que é infração e qual sanção cabe.', dica: 'Separe prerrogativa de conduta vedada antes de olhar as alternativas.', banco: 'Ética Profissional' },
  { tipo: 'sempre', materia: 'Ética Profissional', tema: 'Incompatibilidades e impedimentos', comoCai: 'Cargo ou função que impede ou incompatibiliza o exercício da advocacia.', dica: 'Incompatibilidade é proibição absoluta; impedimento é relativo a certo caso ou cliente.', banco: 'Ética Profissional' },
  { tipo: 'sempre', materia: 'Direito Constitucional', tema: 'Direitos e garantias fundamentais', comoCai: 'Art. 5º aplicado a um fato concreto, com atenção ao detalhe do enunciado.', dica: 'Leia o fato até o fim: um detalhe muda o direito aplicável.', banco: 'Direito Constitucional' },
  { tipo: 'sempre', materia: 'Direito Constitucional', tema: 'Remédios constitucionais', comoCai: 'Escolher o remédio certo: habeas corpus, mandado de segurança, mandado de injunção, habeas data ou ação popular.', dica: 'Pergunte primeiro: qual direito foi lesado e quem praticou o ato?', banco: 'Direito Constitucional' },
  { tipo: 'sempre', materia: 'Direito Constitucional', tema: 'Controle de constitucionalidade', comoCai: 'ADI, ADC, ADPF e ADO: quem pode propor, com que efeito e perante qual tribunal.', dica: 'Monte um mapa: ação, legitimado, efeito e tribunal.', banco: 'Direito Constitucional' },
  { tipo: 'sempre', materia: 'Direito Civil', tema: 'Contratos e obrigações', comoCai: 'Caso patrimonial em que se aplica a regra do contrato ou da obrigação ao fato.', dica: 'Identifique as partes, o objeto e o que foi descumprido.', banco: 'Direito Civil' },
  { tipo: 'sempre', materia: 'Direito Civil', tema: 'Responsabilidade civil e sucessões', comoCai: 'Quem responde pelo dano e quem herda em cada situação familiar ou patrimonial.', dica: 'Responsabilidade: fato, dano, nexo e culpa ou risco. Sucessão: ordem de vocação.', banco: 'Direito Civil' },
  { tipo: 'sempre', materia: 'Direito Penal', tema: 'Teoria do delito aplicada ao caso', comoCai: 'Narrativa de um fato e pedido de enquadramento: dolo, culpa, tentativa, excludentes.', dica: 'Descreva o fato em uma frase antes de procurar o crime.', banco: 'Direito Penal' },
  { tipo: 'sempre', materia: 'Direito Penal', tema: 'Crimes contra a vida e contra o patrimônio', comoCai: 'Qual crime se configura e qual causa de aumento, diminuição ou extinção se aplica.', dica: 'Compare os elementos do tipo com os fatos, um por um.', banco: 'Direito Penal' },
  { tipo: 'sempre', materia: 'Direito Processual Civil', tema: 'Recursos: apelação e agravo', comoCai: 'Dada uma decisão, qual o recurso cabível, com qual prazo e efeito.', dica: 'Primeiro identifique a natureza da decisão: sentença ou interlocutória.', banco: 'Direito Processual Civil' },
  { tipo: 'sempre', materia: 'Direito Processual Civil', tema: 'Execução, cumprimento de sentença e tutela provisória', comoCai: 'Qual o passo seguinte do processo e qual medida cabe naquela fase.', dica: 'Siga a fase do processo: não pule para o recurso antes de saber onde está.', banco: 'Direito Processual Civil' },
  { tipo: 'sempre', materia: 'Direito Administrativo', tema: 'Atos, servidores, licitação e contratos', comoCai: 'Servidor, licitação ou ato administrativo com pedido de validade, sanção ou responsabilidade.', dica: 'Ato administrativo: atributos e vícios. Servidor: concurso e estabilidade.', banco: 'Direito Administrativo' },
  { tipo: 'sempre', materia: 'Direito Tributário', tema: 'Competência, imunidades e crédito tributário', comoCai: 'Quem pode cobrar, quem está imune, quem responde e como o crédito se extingue.', dica: 'Não confunda imunidade com isenção: uma é constitucional, a outra é legal.', banco: 'Direito Tributário' },
  { tipo: 'sempre', materia: 'Direito Empresarial', tema: 'Falência, recuperação, sociedade e títulos de crédito', comoCai: 'Empresa em crise, sócio ou título, com o regime próprio da matéria.', dica: 'Recuperação tenta salvar a empresa; falência liquida. Títulos: cartularidade, literalidade e autonomia.', banco: 'Direito Empresarial' },
  { tipo: 'sempre', materia: 'Direito do Trabalho', tema: 'Jornada, remuneração e extinção do contrato', comoCai: 'Detalhes de rotina: jornada, verbas, fim do contrato e norma coletiva.', dica: 'Jornada normal: 8h por dia e 44h por semana. Hora extra: no mínimo 50% a mais.', banco: 'Direito do Trabalho' },
  { tipo: 'sempre', materia: 'Direito do Consumidor', tema: 'Responsabilidade pelo fato e pelo vício', comoCai: 'Produto com defeito que causa dano versus produto que só não funciona como deveria.', dica: 'Fato é acidente de consumo; vício é inadequação do produto ou serviço.', banco: null },
  { tipo: 'sempre', materia: 'ECA', tema: 'Ato infracional e medidas socioeducativas', comoCai: 'Situação prática com criança acolhida, convivência familiar ou adolescente autor de ato infracional.', dica: 'Não aplique medida de adulto: o regime do ECA é próprio.', banco: null },
  { tipo: 'sempre', materia: 'Direitos Humanos', tema: 'Pacto de São José e garantias fundamentais', comoCai: 'Questão curta e direta, ligada ao tratado central ou à proteção internacional.', dica: 'Rende com revisão curta e direcionada, não exige estudo horizontal.', banco: null },
  { tipo: 'sempre', materia: 'Direito Eleitoral, Financeiro e Previdenciário', tema: 'Matérias novas desde o Exame 38', comoCai: 'Temas estruturais e literalidade da lei: partidos e condutas vedadas, orçamento e ciclo orçamentário, benefícios e qualidade de segurado.', dica: 'Por serem novas, costumam cobrar a letra da lei. Foque nos conceitos básicos.', banco: null },
  { tipo: 'formato', materia: 'Direito Constitucional', tema: 'Remédios constitucionais: mesma regra, outro caso', comoCai: 'Direta: qual remédio protege direito líquido e certo. Mini-caso: pessoa impedida de ver seus próprios dados num cadastro público — a resposta passa a ser habeas data. Armadilha: trocar mandado de segurança por habeas corpus, ou ignorar a prova pré-constituída.', dica: 'O tema é o mesmo, o fato decide o remédio.', banco: 'Direito Constitucional' },
  { tipo: 'formato', materia: 'Direito Constitucional', tema: 'Súmula vinculante: efeitos e abrangência', comoCai: 'Direta: quem se vincula. Mini-caso: STF aprova súmula e há projeto de lei em tramitação com teor conflitante. Armadilha: restringir o efeito só ao Judiciário, excluindo a Administração Pública.', dica: 'Súmula vinculante vincula Judiciário e Administração Pública.', banco: 'Direito Constitucional' },
  { tipo: 'formato', materia: 'Ética Profissional', tema: 'Prerrogativas e incompatibilidades em mini-caso', comoCai: 'Direta: qual conduta é prerrogativa. Mini-caso: advogado que, por sua condição ou cargo, enfrenta restrição no fórum ou conflito para advogar. Armadilha: estender a prerrogativa a quem não a tem, ou tratar incompatibilidade como mero impedimento.', dica: 'A regra é a mesma, muda a história.', banco: 'Ética Profissional' },
  { tipo: 'formato', materia: 'ECA', tema: 'Ato infracional e medida socioeducativa', comoCai: 'Caso 1: criança acolhida e convivência familiar. Caso 2: adolescente autor de ato infracional e medida aplicável. Armadilha: aplicar medida de adulto ou ignorar a gravidade do ato.', dica: 'Mesmo núcleo, fatos diferentes — foi o que aconteceu nas questões 43 e 44 do 47º e na 43 do 46º, segundo o Estratégia OAB.', banco: null },
  { tipo: 'formato', materia: 'Direito do Consumidor', tema: 'Fato versus vício', comoCai: 'Caso 1: produto defeituoso que causa dano à saúde. Caso 2: produto que simplesmente não funciona. Armadilha: tratar vício como se fosse fato, invertendo prazo e reparação.', dica: 'A distinção é a mesma; a consequência muda com o fato.', banco: null },
  { tipo: 'formato', materia: 'Direito Processual Civil', tema: 'Cabimento recursal', comoCai: 'Sentença leva a apelação; decisão interlocutória leva a agravo. A lógica é a mesma, a resposta muda com o ato. Armadilha: o recurso certo para outro tipo de decisão, ou prazo e efeito trocados.', dica: 'Identifique a decisão antes de escolher o recurso.', banco: 'Direito Processual Civil' },
  { tipo: 'formato', materia: 'Direito do Trabalho', tema: 'Jornada e remuneração', comoCai: 'Mesma regra de cálculo aplicada a jornadas, turnos e formas de extinção diferentes. Armadilha: aplicar a regra de um turno a outro, ou confundir verba salarial com indenizatória.', dica: 'Anote a regra em uma frase; depois troque só os números e os fatos.', banco: 'Direito do Trabalho' },
  { tipo: 'formato', materia: 'Direito Tributário', tema: 'Competência, imunidade e isenção', comoCai: 'Caso em que outro ente cobra o tributo, ou o contribuinte invoca imunidade numa situação nova. Armadilha: atribuir a competência ao ente errado, ou confundir imunidade com isenção.', dica: 'Competência diz quem pode criar; imunidade diz o que nem pode ser tributado.', banco: 'Direito Tributário' },
]

export const PASSOS_PARA_PASSAR = [
  { titulo: '1. Comece pelo peso', texto: 'Dê mais tempo ao núcleo pesado (Ética + Constitucional + Civil + Processo Civil + Penal + Processo Penal = 38 questões) e não abandone as matérias de 2 questões: juntas, são 18 pontos que decidem quem está perto do corte de 40.', acao: '/simulado', acaoTexto: 'Fazer simulado' },
  { titulo: '2. Resolva provas anteriores', texto: 'Resolva o maior número possível de questões de provas anteriores para entender o estilo da FGV e as pegadinhas. Analise também as alternativas erradas e entenda onde está o erro.', acao: '/questoes', acaoTexto: 'Ver questões' },
  { titulo: '3. Revise o erro, não só o acerto', texto: 'Anote cada erro em uma frase: o detalhe que te fez errar. Depois volte ao mesmo tema com outra questão, em outra sessão. É assim que a regra fica, e não a resposta decorada.', acao: '/revisao', acaoTexto: 'Revisar meus erros' },
  { titulo: '4. Revisão espaçada', texto: 'Reveja o tema no dia seguinte, depois com 3 dias e depois com 7 dias. O treino sem repetição deste sistema ajuda: cada simulado traz questões inéditas para você, e a revisão cuida só dos erros.', acao: '/progresso', acaoTexto: 'Ver meu progresso' },
  { titulo: '5. Simulado completo com tempo', texto: 'Na reta final, faça simulados completos semanais em condições reais: sem celular, sem interrupção, dentro do tempo. Treine a média de 3min45s por questão antes do dia da prova.', acao: '/simulado', acaoTexto: 'Fazer prova com timer' },
  { titulo: '6. No dia, ordem inteligente', texto: 'Comece pelas matérias com mais questões e pelas que você domina — Ética é uma boa porta de entrada. Não trave numa questão difícil: marque e volte depois. Não deixe questão em branco, porque errar não desconta ponto.', acao: '/analise', acaoTexto: 'Rever esta página' },
]

export const FONTES = [
  { nome: 'Estratégia OAB — OAB 47: horários e instruções da 1ª fase', url: 'https://oab.estrategia.com/portal/oab-47-horarios-instrucoes-prova-1-fase/' },
  { nome: 'Estratégia OAB — Como estudar para a OAB', url: 'https://oab.estrategia.com/portal/estudar-para-oab/' },
  { nome: 'Passe na Ordem — O que cai na prova da OAB', url: 'https://passenaordem.com/o-que-cai-na-prova-da-oab/' },
  { nome: 'Igor Montalvão — O que mais cai na 1ª fase da OAB em 2026', url: 'https://igormontalvao.com.br/o-que-mais-cai-na-1-fase-da-oab-em-2026/' },
  { nome: 'Gran OAB — Perfil da banca FGV', url: 'https://oab.grancursosonline.com.br/blog/oab-perfil-banca-fgv/' },
  { nome: 'Estratégia OAB — Temas mais cobrados pela FGV', url: 'https://oab.estrategia.com/portal/oab-1-fase-assuntos-mais-cobrados-fgv/' },
  { nome: 'Estratégia OAB — Rotina de estudos para a 1ª fase', url: 'https://oab.estrategia.com/portal/rotina-estudos-aprovacao-oab/' },
  { nome: 'Estratégia OAB — Matérias de menor incidência na OAB 48', url: 'https://oab.estrategia.com/portal/oab-48-como-estudar-materias-menor-incidencia/' },
  { nome: 'Ceisc — Como passar na OAB', url: 'https://ceisc.com.br/blog/post/como-passar-oab' },
]
