export interface EditalSubject {
  name: string;
  weight: number;
  topicsCount: number;
  priority: 'alta' | 'media' | 'baixa';
  keyTopics: string[];
}

export interface EditalCatalogItem {
  slug: string;
  title: string;
  institution: string;
  banca: string;
  role: string;
  salary: string;
  vacancies: number;
  examDate: string;
  summary: string;
  subjects: EditalSubject[];
  faq: { question: string; answer: string }[];
}

export const EDITAIS_CATALOG: Record<string, EditalCatalogItem> = {
  'inss-tecnico-seguro-social-2026': {
    slug: 'inss-tecnico-seguro-social-2026',
    title: 'Edital INSS 2026 — Técnico do Seguro Social',
    institution: 'Instituto Nacional do Seguro Social (INSS)',
    banca: 'Cebraspe',
    role: 'Técnico do Seguro Social',
    salary: 'R$ 6.596,52 + Benefícios',
    vacancies: 1500,
    examDate: 'Outubro de 2026',
    summary: 'Concurso de nível médio com foco primário em Seguridade Social (70 questões na prova Cebraspe). Maior concurso federal da carreira previdenciária.',
    subjects: [
      { 
        name: 'Seguridade Social (Legislação Previdenciária)', 
        weight: 3, 
        topicsCount: 38, 
        priority: 'alta',
        keyTopics: ['Princípios da Seguridade', 'Regime Geral (RGPS)', 'Beneficiários e Dependentes', 'Benefícios em Espécie', 'Financiamento da Seguridade', 'Crimes Previdenciários']
      },
      { 
        name: 'Língua Portuguesa', 
        weight: 2, 
        topicsCount: 16, 
        priority: 'alta',
        keyTopics: ['Interpretação Textual Cebraspe', 'Tipologia Textual', 'Concordância e Regência', 'Pontuação e Crase', 'Reescrita de Frases']
      },
      { 
        name: 'Direito Constitucional', 
        weight: 2, 
        topicsCount: 12, 
        priority: 'media',
        keyTopics: ['Direitos e Deveres Fundamentais (Art. 5º)', 'Nacionalidade e Direitos Políticos', 'Organização do Estado', 'Administração Pública na CF/88']
      },
      { 
        name: 'Direito Administrativo', 
        weight: 2, 
        topicsCount: 14, 
        priority: 'media',
        keyTopics: ['Lei 8.112/1990 Completa', 'Poderes Administrativos', 'Atos Administrativos', 'Nova Lei de Licitações (Lei 14.133)']
      },
      { 
        name: 'Raciocínio Lógico-Matemático', 
        weight: 1, 
        topicsCount: 9, 
        priority: 'baixa',
        keyTopics: ['Estruturas Lógicas', 'Lógica de Proposições', 'Tabelas-Verdade', 'Diagramas Lógicos']
      },
      { 
        name: 'Noções de Informática', 
        weight: 1, 
        topicsCount: 11, 
        priority: 'baixa',
        keyTopics: ['Segurança da Informação', 'Navegadores e Correio', 'Redes de Computadores', 'Sistemas Operacionais Windows e Linux']
      },
    ],
    faq: [
      {
        question: 'Qual a matéria mais importante para o concurso do INSS?',
        answer: 'A disciplina de Seguridade Social representa aproximadamente 70% dos pontos da prova da Cebraspe e deve receber prioridade absoluta no ciclo de estudos.'
      },
      {
        question: 'O edital verticalizado inclui controle de revisões?',
        answer: 'Sim, a planilha gerada pela IA já possui colunas para revisão em 24h, 7 dias e 30 dias com base na Curva de Esquecimento de Ebbinghaus.'
      },
      {
        question: 'Qual é a banca provável do próximo concurso INSS?',
        answer: 'O Cebraspe historicamente realiza os certames nacionais do INSS no modelo de itens Certo/Errado com fator de correção.'
      }
    ]
  },

  'tjsp-escrevente-tecnico-judiciario-2026': {
    slug: 'tjsp-escrevente-tecnico-judiciario-2026',
    title: 'Edital TJ-SP 2026 — Escrevente Técnico Judiciário',
    institution: 'Tribunal de Justiça de São Paulo (TJ-SP)',
    banca: 'Vunesp',
    role: 'Escrevente Técnico Judiciário',
    salary: 'R$ 7.250,00 + Auxílios (Alimentação, Saúde e Transporte)',
    vacancies: 560,
    examDate: 'Novembro de 2026',
    summary: 'O concurso do TJSP é o maior certame judiciário do Brasil para nível médio. Exige domínio literal das Normas da Corregedoria e Processo Civil.',
    subjects: [
      { 
        name: 'Língua Portuguesa (Vunesp)', 
        weight: 3, 
        topicsCount: 24, 
        priority: 'alta',
        keyTopics: ['Interpretação e Sentido de Textos', 'Sinônimos e Antônimos', 'Crase e Regência', 'Colocação Pronominal']
      },
      { 
        name: 'Normas da Corregedoria Geral da Justiça (NSCGJ)', 
        weight: 3, 
        topicsCount: 15, 
        priority: 'alta',
        keyTopics: ['Escrituração e Expedição de Mandados', 'Livros e Classificadores Obrigatórios', 'Processo Eletrônico (SAJ)', 'Penalidades Administrativas']
      },
      { 
        name: 'Direito Processual Civil & Penal', 
        weight: 3, 
        topicsCount: 26, 
        priority: 'alta',
        keyTopics: ['Prazos Processuais', 'Citação e Intimação', 'Provas e Recursos', 'Competência Jurisdicional', 'Crimes Funcionais (CP)']
      },
      { 
        name: 'Direito Constitucional e Administrativo', 
        weight: 2, 
        topicsCount: 18, 
        priority: 'media',
        keyTopics: ['Art. 5º da CF', 'Estatuto dos Funcionários Públicos SP (Lei 10.261)', 'Improbidade Administrativa (Lei 8.429)']
      },
      { 
        name: 'Matemática e Raciocínio Lógico', 
        weight: 1, 
        topicsCount: 10, 
        priority: 'baixa',
        keyTopics: ['Porcentagem e Regra de Três', 'Equações e Sistemas', 'Equivalências Lógicas']
      },
      { 
        name: 'Atualidades e Estatuto da Pessoa com Deficiência', 
        weight: 1, 
        topicsCount: 8, 
        priority: 'baixa',
        keyTopics: ['Fatos Noticiosos Recentes', 'Lei Brasileira de Inclusão (Lei 13.146/15)']
      },
    ],
    faq: [
      {
        question: 'Quantas questões tem a prova do TJSP Escrevente?',
        answer: 'A prova da Vunesp conta tradicionalmente com 100 questões objetivas de múltipla escolha com 5 alternativas.'
      },
      {
        question: 'É necessária formação em Direito?',
        answer: 'Não. O cargo de Escrevente do TJ-SP exige apenas nível médio completo.'
      }
    ]
  },

  'prf-policial-rodoviario-federal-2026': {
    slug: 'prf-policial-rodoviario-federal-2026',
    title: 'Edital PRF 2026 — Policial Rodoviário Federal',
    institution: 'Polícia Rodoviária Federal (PRF)',
    banca: 'Cebraspe',
    role: 'Policial Rodoviário Federal',
    salary: 'R$ 10.742,00 + Benefícios e Adicional Noturno',
    vacancies: 800,
    examDate: 'Dezembro de 2026',
    summary: 'Carreira policial federal de ponta. Foco absoluto no Bloco II (Legislação de Trânsito) e disciplinas jurídicas aliadas a TAF de alta exigência.',
    subjects: [
      { 
        name: 'Legislação de Trânsito (Bloco II — CTB & Resoluções Contran)', 
        weight: 3, 
        topicsCount: 45, 
        priority: 'alta',
        keyTopics: ['Código de Trânsito Brasileiro Completo', 'Infrações e Penalidades', 'Crimes de Trânsito', 'Resoluções do Contran Atualizadas']
      },
      { 
        name: 'Língua Portuguesa', 
        weight: 2, 
        topicsCount: 20, 
        priority: 'alta',
        keyTopics: ['Compreensão de Texto', 'Mecanismos de Coesão', 'Pontuação e Sintaxe', 'Reescrita e Equivalência Cebraspe']
      },
      { 
        name: 'Noções de Direito Penal e Processual Penal', 
        weight: 2, 
        topicsCount: 26, 
        priority: 'alta',
        keyTopics: ['Tipicidade e Ilicitude', 'Crimes contra a Pessoa e Patrimônio', 'Prisão em Flagrante', 'Inquérito Policial']
      },
      { 
        name: 'Direito Constitucional e Direitos Humanos', 
        weight: 2, 
        topicsCount: 18, 
        priority: 'media',
        keyTopics: ['Segurança Pública (Art. 144 CF)', 'Direitos Fundamentais', 'Tratados Internacionais de Direitos Humanos']
      },
      { 
        name: 'Física Aplicada', 
        weight: 1, 
        topicsCount: 12, 
        priority: 'media',
        keyTopics: ['Cinemática Escalar', 'Movimento Circular', 'Trabalho e Energia', 'Colisões e Atrito']
      },
      { 
        name: 'Geopolítica Brasileira & Informática', 
        weight: 1, 
        topicsCount: 14, 
        priority: 'baixa',
        keyTopics: ['Matriz de Transportes Nacional', 'Fronteiras e Segurança', 'Segurança da Informação e Nuvem']
      },
    ],
    faq: [
      {
        question: 'Qual o peso da Legislação de Trânsito na PRF?',
        answer: 'O Bloco II de Legislação de Trânsito compõe 30 questões exclusivas da prova, sendo o maior divisor de águas da aprovação.'
      }
    ]
  },

  'pf-agente-policia-federal-2026': {
    slug: 'pf-agente-policia-federal-2026',
    title: 'Edital PF 2026 — Agente da Polícia Federal',
    institution: 'Polícia Federal (PF)',
    banca: 'Cebraspe',
    role: 'Agente de Polícia Federal',
    salary: 'R$ 13.649,52 + Benefícios e Adicional de Fronteira',
    vacancies: 600,
    examDate: 'Outubro de 2026',
    summary: 'Concurso de elite da Polícia Federal. Exige alto domínio do Bloco I, com destaque decisivo para Contabilidade Geral, Informática avançada e Estatística.',
    subjects: [
      { 
        name: 'Informática Avançada & Ciência de Dados', 
        weight: 3, 
        topicsCount: 36, 
        priority: 'alta',
        keyTopics: ['Banco de Dados Relacional e SQL', 'Redes de Comunicação e Protocolos TCP/IP', 'Python e R Básico', 'Segurança da Informação e Criptografia']
      },
      { 
        name: 'Contabilidade Geral', 
        weight: 3, 
        topicsCount: 24, 
        priority: 'alta',
        keyTopics: ['Patrimônio e Equação Patrimonial', 'Plano de Contas e Escrituração', 'Demonstrações Contábeis (DRE e Balanço)', 'Pronunciamentos CPC']
      },
      { 
        name: 'Língua Portuguesa', 
        weight: 2, 
        topicsCount: 18, 
        priority: 'alta',
        keyTopics: ['Interpretação Textual Cebraspe', 'Mecanismos de Coesão', 'Sintaxe da Oração e Período']
      },
      { 
        name: 'Estatística', 
        weight: 2, 
        topicsCount: 16, 
        priority: 'media',
        keyTopics: ['Estatística Descritiva', 'Probabilidade e Variáveis Aleatórias', 'Inferência Estatística e Testes de Hipóteses']
      },
      { 
        name: 'Noções de Direito Penal, Processual Penal e Constitucional', 
        weight: 2, 
        topicsCount: 28, 
        priority: 'media',
        keyTopics: ['Crimes contra a Administração Pública', 'Inquérito Policial e Provas', 'Artigo 5º e 144 da CF/88']
      },
      { 
        name: 'Raciocínio Lógico', 
        weight: 1, 
        topicsCount: 10, 
        priority: 'baixa',
        keyTopics: ['Estruturas Lógicas e Argumentação', 'Lógica Sentencial']
      },
    ],
    faq: [
      {
        question: 'Quais as matérias com mais questões na PF?',
        answer: 'Informática e Contabilidade representam juntas mais da metade da prova de Agente da Polícia Federal.'
      }
    ]
  },

  'receita-federal-auditor-fiscal-2026': {
    slug: 'receita-federal-auditor-fiscal-2026',
    title: 'Edital Receita Federal 2026 — Auditor-Fiscal',
    institution: 'Secretaria Especial da Receita Federal do Brasil (RFB)',
    banca: 'FGV Concursos',
    role: 'Auditor-Fiscal da Receita Federal',
    salary: 'R$ 22.921,71 + Bônus de Eficiência Tributária',
    vacancies: 400,
    examDate: 'Novembro de 2026',
    summary: 'Maior concurso fiscal da União. Prova de altíssima exigência pela FGV com foco em Direito Tributário, Legislação Aduaneira, Fluência em Dados e Auditoria.',
    subjects: [
      { 
        name: 'Direito Tributário e Legislação Tributária', 
        weight: 3, 
        topicsCount: 38, 
        priority: 'alta',
        keyTopics: ['Sistema Tributário Nacional', 'CTN Completo', 'Impostos Federais (IR, IPI, IOF, ITR)', 'Planejamento Tributário e Elisão']
      },
      { 
        name: 'Legislação Aduaneira e Comércio Internacional', 
        weight: 3, 
        topicsCount: 30, 
        priority: 'alta',
        keyTopics: ['Regulamento Aduaneiro (Decreto 6.759)', 'Regimes Aduaneiros Especiais', 'Valoração Aduaneira e Incoterms', 'Controle Aduaneiro de Cargas']
      },
      { 
        name: 'Contabilidade Geral e Avançada', 
        weight: 3, 
        topicsCount: 32, 
        priority: 'alta',
        keyTopics: ['Pronunciamentos Técnicos CPC', 'Combinação de Negócios e Consolidação', 'Auditoria Contábil e Evidências']
      },
      { 
        name: 'Fluência em Dados e Inteligência Artificial', 
        weight: 2, 
        topicsCount: 22, 
        priority: 'media',
        keyTopics: ['Modelagem de Dados e SQL', 'Mineração de Dados e Analytics', 'Noções de Python para Análise Fiscal']
      },
      { 
        name: 'Direito Constitucional e Administrativo', 
        weight: 2, 
        topicsCount: 24, 
        priority: 'media',
        keyTopics: ['Controle de Constitucionalidade', 'Finanças Públicas e Orçamento', 'Regime Jurídico dos Servidores']
      },
      { 
        name: 'Língua Portuguesa & Língua Inglesa', 
        weight: 2, 
        topicsCount: 18, 
        priority: 'baixa',
        keyTopics: ['Estilo Textual FGV', 'Compreensão de Artigos Econômicos em Inglês']
      },
    ],
    faq: [
      {
        question: 'Quem pode prestar Auditor-Fiscal da Receita Federal?',
        answer: 'Exige curso superior completo em qualquer área de formação reconhecida pelo MEC.'
      }
    ]
  },

  'cnu-concurso-nacional-unificado-2026': {
    slug: 'cnu-concurso-nacional-unificado-2026',
    title: 'Edital CNU 2026 — Concurso Nacional Unificado',
    institution: 'Ministério da Gestão e Inovação (MGI)',
    banca: 'Fundação Cesgranrio',
    role: 'Carreiras dos Blocos Temáticos Federais',
    salary: 'R$ 7.500 a R$ 21.000 (a depender do Bloco)',
    vacancies: 6500,
    examDate: 'Outubro de 2026',
    summary: 'Conhecido como o "Enem dos Concursos", o CNU reúne centenas de órgãos do Governo Federal com matriz interdisciplinar de conhecimentos gerais e eixos temáticos específicos.',
    subjects: [
      { 
        name: 'Políticas Públicas e Estado Democrático', 
        weight: 3, 
        topicsCount: 22, 
        priority: 'alta',
        keyTopics: ['Ciclo de Políticas Públicas', 'Participação Social e Controle', 'Transparência e Lei de Acesso à Informação']
      },
      { 
        name: 'Ética, Integridade e Governança Pública', 
        weight: 2, 
        topicsCount: 15, 
        priority: 'alta',
        keyTopics: ['Ética no Setor Público', 'Gestão de Riscos e Integridade', 'Nova Lei de Licitações (14.133/21)']
      },
      { 
        name: 'Diversidade, Direitos Humanos e Inclusão', 
        weight: 2, 
        topicsCount: 16, 
        priority: 'media',
        keyTopics: ['Estatuto da Igualdade Racial', 'Povos Indígenas e Comunidades Tradicionais', 'Direitos das Pessoas com Deficiência']
      },
      { 
        name: 'Administração Pública Federal & Orçamento', 
        weight: 3, 
        topicsCount: 25, 
        priority: 'alta',
        keyTopics: ['PPA, LDO e LOA', 'Gestão Estratégica e Indicadores', 'Transformação Digital no Governo (Gov.br)']
      },
      { 
        name: 'Eixos Temáticos Específicos do Bloco Escolhido', 
        weight: 3, 
        topicsCount: 35, 
        priority: 'alta',
        keyTopics: ['Gestão Governamental', 'Tecnologia da Informação', 'Saúde Pública e Meio Ambiente']
      },
    ],
    faq: [
      {
        question: 'Como funciona a escolha dos cargos no CNU?',
        answer: 'O candidato concorre a todos os cargos do mesmo bloco temático, ordenando por ordem de preferência.'
      }
    ]
  },

  'banco-do-brasil-escriturario-2026': {
    slug: 'banco-do-brasil-escriturario-2026',
    title: 'Edital Banco do Brasil 2026 — Escriturário / Agente Comercial',
    institution: 'Banco do Brasil S.A.',
    banca: 'Fundação Cesgranrio',
    role: 'Escriturário (Agente Comercial e Agente de Tecnologia)',
    salary: 'R$ 4.600,00 + Participação nos Lucros (PLR) e Benefícios',
    vacancies: 4000,
    examDate: 'Segundo Semestre de 2026',
    summary: 'Maior concurso da carreira bancária nacional para nível médio. Conteúdo centrado em Vendas e Negociação, Conhecimentos Bancários e Informática.',
    subjects: [
      { 
        name: 'Conhecimentos Bancários', 
        weight: 3, 
        topicsCount: 28, 
        priority: 'alta',
        keyTopics: ['Sistema Financeiro Nacional (SFN)', 'Mercado de Câmbio e Moedas Digitais', 'Produtos Bancários e Garantias', 'Lavagem de Dinheiro (Lei 9.613)']
      },
      { 
        name: 'Vendas e Negociação', 
        weight: 3, 
        topicsCount: 22, 
        priority: 'alta',
        keyTopics: ['Técnicas de Vendas e Abordagem', 'Código de Defesa do Consumidor Bancário', 'Ética e Conduta no Atendimento', 'Marketing de Relacionamento']
      },
      { 
        name: 'Língua Portuguesa', 
        weight: 2, 
        topicsCount: 16, 
        priority: 'alta',
        keyTopics: ['Compreensão de Texto Cesgranrio', 'Ortografia e Pontuação', 'Regência e Crase']
      },
      { 
        name: 'Conhecimentos de Informática', 
        weight: 2, 
        topicsCount: 20, 
        priority: 'media',
        keyTopics: ['Segurança na Nuvem', 'Ferramentas de Colaboração', 'Manipulação de Planilhas e Dados']
      },
      { 
        name: 'Matemática Financeira', 
        weight: 2, 
        topicsCount: 14, 
        priority: 'media',
        keyTopics: ['Juros Simples e Compostos', 'Descontos e Equivalência de Capitais', 'Sistemas de Amortização (SAC e Price)']
      },
    ],
    faq: [
      {
        question: 'O Banco do Brasil paga participação nos lucros (PLR)?',
        answer: 'Sim, além do salário base e auxílio-alimentação de cerca de R$ 1.800, os funcionários recebem PLR semestral atrativa.'
      }
    ]
  },

  'caixa-economica-federal-tecnico-bancario-2026': {
    slug: 'caixa-economica-federal-tecnico-bancario-2026',
    title: 'Edital Caixa 2026 — Técnico Bancário Novo',
    institution: 'Caixa Econômica Federal (CEF)',
    banca: 'Fundação Cesgranrio',
    role: 'Técnico Bancário Novo (Geral e TI)',
    salary: 'R$ 4.750,00 + Auxílios e Previdência Complementar',
    vacancies: 3200,
    examDate: 'Segundo Semestre de 2026',
    summary: 'Certame de ampla concorrência nacional com estabilidade e plano de carreira robusto. Foco em Atendimento, Conhecimentos Bancários e Tecnologia.',
    subjects: [
      { 
        name: 'Conhecimentos Bancários & Mercado Imobiliário', 
        weight: 3, 
        topicsCount: 26, 
        priority: 'alta',
        keyTopics: ['Estrutura do SFN e Banco Central', 'Financiamento Habitacional e FGTS', 'Seguros e Previdência Caixa']
      },
      { 
        name: 'Atendimento e Vendas no Setor Público Bancário', 
        weight: 3, 
        topicsCount: 20, 
        priority: 'alta',
        keyTopics: ['Resolução CMN 4.949', 'Experiência do Cliente (CX)', 'Estratégias de Negociação']
      },
      { 
        name: 'Língua Portuguesa', 
        weight: 2, 
        topicsCount: 15, 
        priority: 'alta',
        keyTopics: ['Interpretação Textual Cesgranrio', 'Concordância Verbal e Nominal', 'Coesão e Coerência']
      },
      { 
        name: 'Tecnologia da Informação & Ferramentas Digitais', 
        weight: 2, 
        topicsCount: 18, 
        priority: 'media',
        keyTopics: ['Big Data e Inteligência Artificial Básica', 'Cibersegurança e Proteção de Dados (LGPD)']
      },
      { 
        name: 'Probabilidade e Estatística', 
        weight: 1, 
        topicsCount: 12, 
        priority: 'baixa',
        keyTopics: ['Cálculo de Médias e Desvios', 'Distribuição Normal e Probabilidade']
      },
    ],
    faq: [
      {
        question: 'Qual a jornada de trabalho na Caixa?',
        answer: 'A jornada para Técnico Bancário é de 6 horas diárias (30 horas semanais).'
      }
    ]
  },

  'oab-43-exame-de-ordem-2026': {
    slug: 'oab-43-exame-de-ordem-2026',
    title: 'OAB 43º Exame de Ordem Unificado (2026)',
    institution: 'Ordem dos Advogados do Brasil (CFOAB)',
    banca: 'FGV Concursos',
    role: 'Advogado (Inscrição nos Quadros da OAB)',
    salary: 'Habilitação Profissional Privativa',
    vacancies: 9999,
    examDate: 'Julho de 2026',
    summary: 'Acesso indispensável à advocacia nacional. A 1ª fase exige acertar 40 de 80 questões, com 8 pontos essenciais concentrados exclusivamente em Ética Profissional.',
    subjects: [
      { 
        name: 'Ética Profissional e Estatuto da Advocacia', 
        weight: 3, 
        topicsCount: 18, 
        priority: 'alta',
        keyTopics: ['Direitos e Prerrogativas do Advogado', 'Infrações e Sanções Disciplinares', 'Honorários Advocatícios', 'Incompatibilidades e Impedimentos']
      },
      { 
        name: 'Direito Civil e Processual Civil', 
        weight: 3, 
        topicsCount: 36, 
        priority: 'alta',
        keyTopics: ['Negócio Jurídico e Prescrição', 'Família e Sucessões', 'Tutelas Provisórias', 'Procedimento Comum e Recursos']
      },
      { 
        name: 'Direito Constitucional', 
        weight: 2, 
        topicsCount: 22, 
        priority: 'alta',
        keyTopics: ['Ações Constitucionais (MS, HC, MI, AP)', 'Controle Concentrado e Difuso', 'Organização dos Poderes']
      },
      { 
        name: 'Direito Penal e Processual Penal', 
        weight: 2, 
        topicsCount: 30, 
        priority: 'media',
        keyTopics: ['Teoria do Crime e Concurso de Pessoas', 'Crimes em Espécie', 'Provas e Recursos no CPP']
      },
      { 
        name: 'Direito do Trabalho e Processo do Trabalho', 
        weight: 2, 
        topicsCount: 20, 
        priority: 'media',
        keyTopics: ['Contrato de Trabalho e Verbas Rescisórias', 'Recursos Trabalhistas (RO e RR)']
      },
      { 
        name: 'Direito Administrativo e Tributário', 
        weight: 2, 
        topicsCount: 24, 
        priority: 'media',
        keyTopics: ['Responsabilidade Civil do Estado', 'Limitações Constitucionais ao Poder de Tributar']
      },
    ],
    faq: [
      {
        question: 'Quantas questões de Ética caem na 1ª fase da OAB?',
        answer: 'São 8 questões de Ética Profissional e Estatuto da OAB, representando 10% da prova total e 20% do índice mínimo para aprovação.'
      }
    ]
  },

  'policia-civil-sp-investigador-escrivao-2026': {
    slug: 'policia-civil-sp-investigador-escrivao-2026',
    title: 'Edital Polícia Civil SP 2026 — Investigador e Escrivão',
    institution: 'Polícia Civil do Estado de São Paulo (PC-SP)',
    banca: 'Vunesp',
    role: 'Investigador de Polícia e Escrivão de Polícia',
    salary: 'R$ 6.840,00 + Adicional de Insalubridade',
    vacancies: 2500,
    examDate: 'Outubro de 2026',
    summary: 'Tradicional certame da segurança pública paulista organizado pela Vunesp. Exige forte preparo em Direito Penal, Processo Penal, Criminologia e Legislação Especial.',
    subjects: [
      { 
        name: 'Direito Penal e Legislação Penal Especial', 
        weight: 3, 
        topicsCount: 32, 
        priority: 'alta',
        keyTopics: ['Crimes contra a Vida e Patrimônio', 'Crimes Hediondos e Tráfico de Drogas', 'Estatuto do Desarmamento e Maria da Penha']
      },
      { 
        name: 'Direito Processual Penal', 
        weight: 3, 
        topicsCount: 25, 
        priority: 'alta',
        keyTopics: ['Inquérito Policial e Ação Penal', 'Prisões Cautelares e Medidas Assecuratórias', 'Cadeia de Custódia da Prova']
      },
      { 
        name: 'Criminologia e Direitos Humanos', 
        weight: 2, 
        topicsCount: 18, 
        priority: 'alta',
        keyTopics: ['Teorias Criminológicas e Vitimologia', 'Prevenção da Criminalidade', 'Declaração Universal e Pacto de San José']
      },
      { 
        name: 'Língua Portuguesa (Vunesp)', 
        weight: 2, 
        topicsCount: 20, 
        priority: 'alta',
        keyTopics: ['Interpretação Textual e Ambiguidade', 'Sintaxe e Pontuação', 'Crase e Regência']
      },
      { 
        name: 'Noções de Informática e Lógica', 
        weight: 1, 
        topicsCount: 14, 
        priority: 'media',
        keyTopics: ['Segurança da Informação e Crimes Cibernéticos', 'Lógica Sentencial']
      },
      { 
        name: 'Direito Constitucional e Administrativo', 
        weight: 1, 
        topicsCount: 16, 
        priority: 'baixa',
        keyTopics: ['Art. 144 da CF/88', 'Poderes e Responsabilidade Civil do Estado']
      },
    ],
    faq: [
      {
        question: 'A prova da PC-SP tem prova oral?',
        answer: 'Sim, os candidatos aprovados na prova escrita e teste de aptidão psicológica passam pela prova oral gravada perante a banca examinadora da Acadepol.'
      }
    ]
  }
};

export function getEditalBySlug(slug: string): EditalCatalogItem | undefined {
  return EDITAIS_CATALOG[slug];
}

export function getAllEditalSlugs(): string[] {
  return Object.keys(EDITAIS_CATALOG);
}
