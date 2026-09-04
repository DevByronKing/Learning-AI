import { ExamNotice, Question, UserMetrics, Flashcard, DiscursivePrompt, MockExam, MistakeEntry, VadeMecumArticle, MicroSummary } from './types';

export const INITIAL_EXAMS: ExamNotice[] = [
  {
    id: 'exam-inss-2026',
    title: 'INSS 2026 - Técnico do Seguro Social',
    institution: 'Instituto Nacional do Seguro Social',
    banca: 'Cebraspe',
    role: 'Técnico do Seguro Social',
    salary: 'R$ 6.596,52',
    vacancies: 1500,
    examDate: '2026-11-15',
    daysRemaining: 75,
    pdfFileName: 'Edital_Abertura_INSS_2026_Consolidado.pdf',
    uploadedAt: '2026-08-20',
    subjects: [
      {
        id: 'sub-dir-prev',
        name: 'Seguridade Social (Direito Previdenciário)',
        weight: 3,
        relevancePercentage: 58.3,
        totalTopics: 8,
        topics: [
          { id: 'top-prev-1', name: 'Princípios e Diretrizes da Seguridade Social', frequencyInBanca: 'Alta', accuracyRate: 85, status: 'Dominado', articlesOrLaws: ['Art. 194 e 195 da CF/88'] },
          { id: 'top-prev-2', name: 'Segurados Obrigatórios e Facultativos', frequencyInBanca: 'Alta', accuracyRate: 42, status: 'Ponto Cego', articlesOrLaws: ['Art. 11 a 14 da Lei 8.213/91'] },
          { id: 'top-prev-3', name: 'Manutenção e Perda da Qualidade de Segurado (Período de Graça)', frequencyInBanca: 'Alta', accuracyRate: 54, status: 'Instável', articlesOrLaws: ['Art. 15 da Lei 8.213/91'] },
          { id: 'top-prev-4', name: 'Benefícios Previdenciários em Espécie (Aposentadorias e Auxílios)', frequencyInBanca: 'Alta', accuracyRate: 78, status: 'Dominado', articlesOrLaws: ['Lei 8.213/91', 'EC 103/2019'] },
          { id: 'top-prev-5', name: 'Salário de Benefício e Fator Previdenciário', frequencyInBanca: 'Média', accuracyRate: 35, status: 'Ponto Cego', articlesOrLaws: ['Art. 29 da Lei 8.213/91'] },
          { id: 'top-prev-6', name: 'Custeio e Financiamento da Seguridade', frequencyInBanca: 'Média', accuracyRate: 68, status: 'Instável', articlesOrLaws: ['Lei 8.212/91'] },
        ]
      },
      {
        id: 'sub-dir-adm',
        name: 'Direito Administrativo',
        weight: 2,
        relevancePercentage: 16.7,
        totalTopics: 6,
        topics: [
          { id: 'top-adm-1', name: 'Regime Jurídico dos Servidores (Lei 8.112/90)', frequencyInBanca: 'Alta', accuracyRate: 72, status: 'Instável', articlesOrLaws: ['Lei 8.112/90'] },
          { id: 'top-adm-2', name: 'Atos Administrativos (Requisitos, Atributos e Extinção)', frequencyInBanca: 'Alta', accuracyRate: 45, status: 'Ponto Cego', articlesOrLaws: ['Doutrina Hely Lopes Meirelles'] },
          { id: 'top-adm-3', name: 'Poderes Administrativos e Abuso de Poder', frequencyInBanca: 'Média', accuracyRate: 88, status: 'Dominado', articlesOrLaws: ['Lei 13.869/19'] },
          { id: 'top-adm-4', name: 'Improbidade Administrativa (Lei 8.429/92 com reforma da Lei 14.230)', frequencyInBanca: 'Alta', accuracyRate: 50, status: 'Ponto Cego', articlesOrLaws: ['Lei 14.230/21'] },
        ]
      },
      {
        id: 'sub-dir-const',
        name: 'Direito Constitucional',
        weight: 2,
        relevancePercentage: 12.5,
        totalTopics: 5,
        topics: [
          { id: 'top-const-1', name: 'Direitos e Garantias Fundamentais (Art. 5º da CF)', frequencyInBanca: 'Alta', accuracyRate: 91, status: 'Dominado', articlesOrLaws: ['Art. 5º, CF/88'] },
          { id: 'top-const-2', name: 'Administração Pública na CF/88 (Art. 37 ao 41)', frequencyInBanca: 'Alta', accuracyRate: 64, status: 'Instável', articlesOrLaws: ['Art. 37 a 41, CF/88'] },
          { id: 'top-const-3', name: 'Ordem Social e Seguridade na CF', frequencyInBanca: 'Alta', accuracyRate: 80, status: 'Dominado', articlesOrLaws: ['Art. 193 a 204, CF/88'] },
        ]
      },
      {
        id: 'sub-portugues',
        name: 'Língua Portuguesa',
        weight: 1,
        relevancePercentage: 12.5,
        totalTopics: 5,
        topics: [
          { id: 'top-port-1', name: 'Interpretação e Compreensão de Texto (Cebraspe Style)', frequencyInBanca: 'Alta', accuracyRate: 60, status: 'Instável' },
          { id: 'top-port-2', name: 'Crase e Regência Verbal/Nominal', frequencyInBanca: 'Alta', accuracyRate: 48, status: 'Ponto Cego' },
          { id: 'top-port-3', name: 'Pontuação (Emprego da Vírgula)', frequencyInBanca: 'Alta', accuracyRate: 75, status: 'Dominado' },
          { id: 'top-port-4', name: 'Concordância Verbal e Nominal', frequencyInBanca: 'Média', accuracyRate: 82, status: 'Dominado' },
        ]
      }
    ]
  },
  {
    id: 'exam-oab-43',
    title: 'OAB 43º Exame de Ordem Unificado',
    institution: 'Conselho Federal da OAB',
    banca: 'FGV',
    role: 'Advogado',
    salary: 'Honorários Livres',
    vacancies: 9999,
    examDate: '2026-10-25',
    daysRemaining: 54,
    pdfFileName: 'Edital_OAB_43_Exame.pdf',
    uploadedAt: '2026-08-15',
    subjects: [
      {
        id: 'sub-oab-etica',
        name: 'Ética Profissional e Estatuto da OAB',
        weight: 3,
        relevancePercentage: 20.0,
        totalTopics: 4,
        topics: [
          { id: 'top-etica-1', name: 'Incompatibilidades e Impedimentos', frequencyInBanca: 'Alta', accuracyRate: 85, status: 'Dominado', articlesOrLaws: ['Art. 27 a 30 do EOAB'] },
          { id: 'top-etica-2', name: 'Sociedade de Advogados e Honorários', frequencyInBanca: 'Alta', accuracyRate: 62, status: 'Instável', articlesOrLaws: ['Art. 15 a 17 e Art. 22 do EOAB'] },
          { id: 'top-etica-3', name: 'Infrações e Sanções Disciplinares', frequencyInBanca: 'Alta', accuracyRate: 40, status: 'Ponto Cego', articlesOrLaws: ['Art. 34 a 43 do EOAB'] }
        ]
      },
      {
        id: 'sub-oab-const',
        name: 'Direito Constitucional',
        weight: 2,
        relevancePercentage: 15.0,
        totalTopics: 4,
        topics: [
          { id: 'top-oab-const-1', name: 'Controle de Constitucionalidade (ADI, ADC, ADPF)', frequencyInBanca: 'Alta', accuracyRate: 38, status: 'Ponto Cego', articlesOrLaws: ['Art. 102 e 103, CF/88'] },
          { id: 'top-oab-const-2', name: 'Ações Constitucionais (MS, HC, HD, Ação Popular)', frequencyInBanca: 'Alta', accuracyRate: 77, status: 'Dominado', articlesOrLaws: ['Art. 5º, LXVIII a LXXIII, CF/88'] }
        ]
      }
    ]
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    subjectId: 'sub-dir-prev',
    subjectName: 'Direito Previdenciário',
    topicId: 'top-prev-2',
    topicName: 'Segurados Obrigatórios e Facultativos',
    banca: 'Cebraspe',
    year: 2026,
    institution: 'INSS',
    statement: 'Acerca da filiação e da inscrição no Regime Geral de Previdência Social (RGPS), julgue o item a seguir:\n\nCarlos, síndico do condomínio onde reside, que não recebe qualquer remuneração nem é isento da taxa condominial em razão do encargo, enquadra-se como segurado obrigatório da Previdência Social na condição de contribuinte individual.',
    codeCitation: 'Art. 12, V, "f", da Lei 8.212/91 e Art. 9º, V, "j", do Dec. 3.048/99',
    options: [
      {
        id: 'opt-1-certo',
        text: 'CERTO',
        isCorrect: false,
        distractorReason: 'A banca induz ao erro ao fazer o candidato achar que qualquer exercício de sindicatura gera filiação obrigatória, ignorando o elemento essencial da remuneração ou dispensa de taxa.'
      },
      {
        id: 'opt-2-errado',
        text: 'ERRADO',
        isCorrect: true
      }
    ],
    explanation: 'O síndico de condomínio SÓ é segurado obrigatório como contribuinte individual SE for remunerado OU se receber dispensa de taxa condominial (que tem natureza remuneratória). Se exercer a função gratuitamente e pagar o condomínio integralmente, NÃO é segurado obrigatório (podendo se filiar apenas como facultativo).',
    lawArticles: ['Art. 12, V, "f", Lei 8.212/91', 'Decreto 3.048/99, art. 9º, § 15'],
    cognitiveAnalysis: {
      commonTrap: 'Confundir o cargo de síndico per se com a obrigatoriedade tributária, omitindo o requisito "remuneração/isenção".',
      keyConcept: 'Contribuinte Individual exige habitualidade E auferimento de remuneração pelo trabalho.',
      bancaTendency: 'O Cebraspe adora retirar um requisito legal negativo da frase para tornar a afirmação absoluta e falsa.'
    }
  },
  {
    id: 'q-2',
    subjectId: 'sub-dir-adm',
    subjectName: 'Direito Administrativo',
    topicId: 'top-adm-4',
    topicName: 'Improbidade Administrativa (Lei 8.429/92 reformada)',
    banca: 'FGV',
    year: 2026,
    institution: 'OAB / Tribunais',
    statement: 'João, Auditor Fiscal da Receita, cometeu grave erro de cálculo em um procedimento fiscalizatório por manifesta imprudência e imperícia, gerando um prejuízo de R$ 300.000,00 aos cofres públicos. Não foi comprovada intenção de lesar o erário ou obtenção de vantagem ilícita.\n\nÀ luz da Nova Lei de Improbidade Administrativa (Lei nº 14.230/2021), a conduta de João:',
    codeCitation: 'Art. 1º, §§ 1º e 2º, e Art. 10 da Lei 8.429/92 (Redação dada pela Lei 14.230/21)',
    options: [
      {
        id: 'opt-2-a',
        text: 'Configura ato de improbidade administrativa que causa lesão ao erário na modalidade culposa, respondendo João pelo ressarcimento.',
        isCorrect: false,
        distractorReason: 'Pegadinha clássica de desatualização: a redação original de 1992 permitia culpa no art. 10, mas a Lei 14.230/2021 EXTINGUIU a modalidade culposa em toda a lei!'
      },
      {
        id: 'opt-2-b',
        text: 'Não configura ato de improbidade administrativa, pois a legislação atual exige o dolo específico com comprovação de vontade livre e consciente de alcançar o resultado ilícito.',
        isCorrect: true
      },
      {
        id: 'opt-2-c',
        text: 'Configura ato de improbidade atentatório aos princípios da administração pública, mesmo sem dolo.',
        isCorrect: false,
        distractorReason: 'O art. 11 também exige dolo específico e teve rol taxativo instituído.'
      },
      {
        id: 'opt-2-d',
        text: 'Configura improbidade com atenuação de pena caso haja restituição espontânea antes da citação.',
        isCorrect: false,
        distractorReason: 'Não há enquadramento de improbidade sem dolo, logo não há dosimetria.'
      }
    ],
    explanation: 'Com a entrada em vigor da Lei nº 14.230/2021, o ordenamento jurídico brasileiro passou a exigir expressamente o DOLO ESPECÍFICO para todas as figuras de improbidade administrativa (artigos 9º, 10 e 11). O mero ato culposo, negligente ou imperito pode gerar responsabilidade civil ou disciplinar, mas JAMAIS improbidade.',
    lawArticles: ['Lei 8.429/92, art. 1º, § 1º e § 2º', 'Tema 1.199 do STF (ARE 843.989)'],
    cognitiveAnalysis: {
      commonTrap: 'Lembrar da regra antiga do Art. 10 (que admitia culpa) e esquecer a unificação do dolo pela reforma de 2021.',
      keyConcept: 'Não existe mais improbidade culposa no Brasil sob nenhuma hipótese.',
      bancaTendency: 'A FGV coloca casos concretos com danos vultosos para comover o estudante a marcar punição por improbidade.'
    }
  },
  {
    id: 'q-3',
    subjectId: 'sub-dir-prev',
    subjectName: 'Direito Previdenciário',
    topicId: 'top-prev-3',
    topicName: 'Manutenção e Perda da Qualidade de Segurado (Período de Graça)',
    banca: 'Cebraspe',
    year: 2026,
    institution: 'INSS',
    statement: 'Mariana verteu mais de 120 contribuições mensais sem interrupção ao RGPS. Em janeiro de 2025, foi demitida e passou a receber seguro-desemprego, permanecendo em situação de desemprego involuntário comprovado nos órgãos competentes. \n\nNessa situação, o período de graça que mantém a qualidade de segurada de Mariana sem necessidade de novas contribuições poderá ser prorrogado por até:',
    codeCitation: 'Art. 15, II, §§ 1º e 2º, da Lei 8.213/91',
    options: [
      {
        id: 'opt-3-a',
        text: '12 meses improrrogáveis.',
        isCorrect: false,
        distractorReason: '12 meses é apenas o prazo básico do art. 15, II.'
      },
      {
        id: 'opt-3-b',
        text: '24 meses.',
        isCorrect: false,
        distractorReason: 'O candidato esquece de somar a segunda prorrogação do desemprego involuntário.'
      },
      {
        id: 'opt-3-c',
        text: '36 meses.',
        isCorrect: true
      },
      {
        id: 'opt-3-d',
        text: '48 meses.',
        isCorrect: false,
        distractorReason: 'Não existe prorrogação de 48 meses na legislação previdenciária.'
      }
    ],
    explanation: 'Cálculo do Período de Graça:\n1. Prazo base (Art. 15, II): 12 meses.\n2. Prorrogação por ter mais de 120 contribuições sem perda da qualidade (Art. 15, § 1º): + 12 meses.\n3. Prorrogação por comprovação de desemprego involuntário (Art. 15, § 2º): + 12 meses.\nTotal Máximo: 12 + 12 + 12 = 36 meses.',
    lawArticles: ['Art. 15 da Lei 8.213/91'],
    cognitiveAnalysis: {
      commonTrap: 'Esquecer a cumulatividade das duas prorrogações legais de 12 meses.',
      keyConcept: 'Regra dos 36 meses = Base (12) + Mais de 120 contribuições (+12) + Desemprego (+12).',
      bancaTendency: 'Bancas adoram somar regras cumulativas em questões de cálculo de prazos previdenciários.'
    }
  },
  {
    id: 'q-4',
    subjectId: 'sub-dir-adm',
    subjectName: 'Direito Administrativo',
    topicId: 'top-adm-2',
    topicName: 'Atos Administrativos (Requisitos, Atributos e Extinção)',
    banca: 'FCC',
    year: 2026,
    institution: 'TRT / TRF',
    statement: 'Em matéria de extinção e convalidação dos atos administrativos, é correto afirmar que a revogação:',
    codeCitation: 'Súmulas 346 e 473 do STF e Art. 53 da Lei 9.784/99',
    options: [
      {
        id: 'opt-4-a',
        text: 'Recai sobre atos ilegais ou ilegítimos e produz efeitos retroativos (ex tunc).',
        isCorrect: false,
        distractorReason: 'Esta é a definição de ANULAÇÃO, e não de revogação.'
      },
      {
        id: 'opt-4-b',
        text: 'Pode ser realizada tanto pela própria Administração Pública quanto pelo Poder Judiciário no exercício de sua função jurisdicional típica.',
        isCorrect: false,
        distractorReason: 'O Judiciário NUNCA pode revogar ato do Executivo por mérito, apenas anular por ilegalidade.'
      },
      {
        id: 'opt-4-c',
        text: 'Recai sobre atos válidos e discricionários por motivos de conveniência e oportunidade, operando efeitos prospectivos (ex nunc).',
        isCorrect: true
      },
      {
        id: 'opt-4-d',
        text: 'Pode incidir livremente sobre atos vinculados, atos consumados e atos que geraram direito adquirido.',
        isCorrect: false,
        distractorReason: 'Atos vinculados, consumados e com direito adquirido são insuscetíveis de revogação.'
      }
    ],
    explanation: 'A revogação é o desfazimento de um ato VÁLIDO e discricionário, privativo da Administração Pública, motivado por critérios de conveniência e oportunidade (mérito administrativo). Seus efeitos são "ex nunc" (não retroagem). O Poder Judiciário jamais revoga atos administrativos de outros Poderes.',
    lawArticles: ['Súmula 473 do STF', 'Art. 53 da Lei Federal nº 9.784/99'],
    cognitiveAnalysis: {
      commonTrap: 'Trocar o binômio Anulação (Ilegal/Ex Tunc) com Revogação (Mérito/Ex Nunc).',
      keyConcept: 'Revogação = Mérito + Ex Nunc + Exclusivo da Administração.',
      bancaTendency: 'FCC frequentemente inverte as palavras-chave "ex tunc" e "ex nunc" entre anulação e revogação.'
    }
  },
  {
    id: 'q-5',
    subjectId: 'sub-oab-etica',
    subjectName: 'Ética Profissional',
    topicId: 'top-etica-1',
    topicName: 'Incompatibilidades e Impedimentos',
    banca: 'FGV',
    year: 2026,
    institution: 'OAB Unificado',
    statement: 'Lucas, advogado regularmente inscrito nos quadros da OAB, é nomeado para exercer o cargo de Diretor-Geral de um hospital público autárquico com competência para ordenar despesas e gerir contratos. Lucas deseja saber se poderá continuar advogando privadamente.\n\nConforme o Estatuto da Advocacia e da OAB (Lei nº 8.906/94), a situação funcional de Lucas acarreta:',
    codeCitation: 'Art. 28, III, da Lei 8.906/94 (EAOAB)',
    options: [
      {
        id: 'opt-5-a',
        text: 'Mero impedimento de advogar apenas contra a Fazenda Pública que o remunera.',
        isCorrect: false,
        distractorReason: 'Cargos de direção com poder de decisão/ordenamento de despesa geram INCOMPATIBILIDADE total, não apenas impedimento parcial.'
      },
      {
        id: 'opt-5-b',
        text: 'Incompatibilidade absoluta com o exercício da advocacia enquanto perdurar a investidura no cargo.',
        isCorrect: true
      },
      {
        id: 'opt-5-c',
        text: 'Autorização tácita para advogar em causa própria e em favor de parentes consanguíneos até o 3º grau.',
        isCorrect: false,
        distractorReason: 'Não há exceção de causa própria na hipótese de incompatibilidade do art. 28.'
      },
      {
        id: 'opt-5-d',
        text: 'Cancelamento definitivo de sua inscrição na OAB, mesmo após o término do mandato diretivo.',
        isCorrect: false,
        distractorReason: 'Cargos temporários geram LICENCIAMENTO (suspensão temporária), e não cancelamento definitivo.'
      }
    ],
    explanation: 'O Art. 28, III, da Lei 8.906/94 estipula que a advocacia é incompatível, mesmo em causa própria, para os ocupantes de cargos ou funções de direção em órgãos da Administração Pública direta ou indireta com competência para tomar decisões ou ordenar despesas.',
    lawArticles: ['Art. 28, III, da Lei 8.906/94', 'Art. 12 do Regulamento Geral da OAB'],
    cognitiveAnalysis: {
      commonTrap: 'Confundir Incompatibilidade (proibição TOTAL da advocacia) com Impedimento (proibição PARCIAL contra ente público específico).',
      keyConcept: 'Diretor/Gestor com poder decisório = Incompatibilidade Total.',
      bancaTendency: 'A FGV sempre coloca cargos com nomes sutis para testar se o aluno sabe a fronteira entre art. 28 (incompatível) e art. 30 (impedido).'
    }
  }
];

export const INITIAL_METRICS: UserMetrics = {
  totalAnswered: 48,
  totalCorrect: 31,
  globalAccuracy: 64.6,
  streakDays: 14,
  estimatedCutoffScore: 78.5,
  probabilityOfPassing: 68.0,
  errorDistribution: {
    pegadinha_banca: 8,
    lacuna_teorica: 5,
    leitura_apressada: 3,
    curva_esquecimento: 1
  },
  bancaAlignment: [
    { banca: 'Cebraspe', userProficiency: 65, bancaRequirement: 80 },
    { banca: 'FGV', userProficiency: 58, bancaRequirement: 75 },
    { banca: 'FCC', userProficiency: 74, bancaRequirement: 82 },
    { banca: 'Vunesp', userProficiency: 80, bancaRequirement: 85 }
  ]
};

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    subjectName: 'Direito Previdenciário',
    topicName: 'Segurados Obrigatórios',
    front: 'O síndico de condomínio isento de taxa condominial é segurado obrigatório da Previdência Social?',
    back: 'SIM! Na condição de Contribuinte Individual. A dispensa ou isenção da taxa condominial tem natureza jurídica de remuneração indireta (Art. 12, V, "f", Lei 8.212/91).',
    nextReviewDate: '2026-09-02',
    intervalDays: 1,
    repetitions: 0,
    easeFactor: 2.5
  },
  {
    id: 'fc-2',
    subjectName: 'Direito Administrativo',
    topicName: 'Improbidade Administrativa',
    front: 'Existe ato de improbidade administrativa culposo na Lei 8.429/92 após a Lei 14.230/2021?',
    back: 'NÃO! A reforma extinguiu qualquer modalidade culposa. Todos os atos de improbidade (arts. 9, 10 e 11) exigem DOLO ESPECÍFICO.',
    nextReviewDate: '2026-09-03',
    intervalDays: 2,
    repetitions: 1,
    easeFactor: 2.6
  },
  {
    id: 'fc-3',
    subjectName: 'Direito Previdenciário',
    topicName: 'Período de Graça',
    front: 'Qual é o prazo máximo de período de graça para quem tem mais de 120 contribuições E comprova desemprego involuntário?',
    back: '36 meses (12 base + 12 por ter >120 contribuições + 12 por desemprego comprovado). Art. 15 da Lei 8.213/91.',
    nextReviewDate: '2026-09-04',
    intervalDays: 3,
    repetitions: 2,
    easeFactor: 2.8
  }
];

export const MOCK_DISCURSIVE_PROMPTS: DiscursivePrompt[] = [
  {
    id: 'disc-pf-2026',
    title: 'Interceptação Telefônica, Cooperação Policial e Lavagem de Capitais',
    banca: 'Cebraspe',
    institution: 'Polícia Federal',
    role: 'Agente de Polícia Federal',
    year: 2026,
    area: 'Policial',
    motivatingText: `A investigação de organizações criminosas dedicadas à lavagem de capitais transnacional tem exigido das polícias judiciárias a utilização articulada de meios extraordinários de obtenção de prova. A Lei nº 9.296/1996, com as inovações introduzidas pela Lei nº 13.964/2019 (Pacote Anticrime), estabeleceu balizas rígidas para a interceptação das comunicações e para a captação ambiental de sinais eletromagnéticos, ópticos ou acústicos. Em contrapartida, a inteligência financeira desempenhada pelo COAF tem sido objeto de reiterados debates nos Tribunais Superiores quanto aos limites do compartilhamento de dados fiscais e bancários com os órgãos de persecução penal sem prévia autorização judicial.`,
    mandatoryTopics: [
      {
        id: 't1',
        description: 'Requisitos constitucionais e infraconstitucionais para a decretação da interceptação telefônica e da captação ambiental (Lei 9.296/96 alterada).',
        maxPoints: 3.5
      },
      {
        id: 't2',
        description: 'Limites constitucionais e jurisprudência vinculante do STF (Tema 990) sobre o compartilhamento de relatórios do COAF com a autoridade policial.',
        maxPoints: 3.5
      },
      {
        id: 't3',
        description: 'A autonomia do crime de lavagem de capitais (Lei 9.613/98) e a validade de medidas assecuratórias patrimoniais.',
        maxPoints: 3.0
      }
    ],
    minLines: 20,
    maxLines: 30,
    officialAnswerModel: `1. O candidato deve apontar que a interceptação telefônica exige ordem judicial fundamentada, indícios razoáveis de autoria, impossibilidade de realização da prova por outros meios disponíveis e que o fato investigado constitua infração punida com reclusão (art. 2º da Lei 9.296/96). Quanto à captação ambiental (art. 8º-A), além de reserva de jurisdição, exige-se elemento probatório de infração penal com pena máxima superior a 4 anos ou cometida por organização criminosa, vedada a instalação em local de trabalho inviolável de advogado.
2. Em relação ao COAF, deve-se citar a tese firmada pelo STF no Tema 990 da Repercussão Geral, que declarou constitucional o compartilhamento direto de Relatórios de Inteligência Financeira (RIF) com a polícia e o MP, sem necessidade de autorização judicial prévia, desde que resguardado o sigilo mediante procedimento formal e preservação da cadeia de custódia.
3. No que tange à lavagem de capitais, deve destacar que se trata de delito autônomo, não dependendo de condenação pelo crime antecedente, bastando a demonstração de indícios suficientes de sua existência. Devem ser destacadas as medidas de sequestro e indisponibilidade de bens, direitos e valores (art. 4º da Lei 9.613/98).`,
    suggestedDraft: `A persecução penal contemporânea no âmbito dos crimes de lavagem de capitais exige a estrita observância das balizas constitucionais e legais que regem a obtenção de elementos probatórios.

Nesse diapasão, a interceptação telefônica, regulada pela Lei nº 9.296/1996, ostenta natureza subsidiária e depende de prévia e fundamentada autorização judicial. Para sua decretação, faz-se imperiosa a presença de indícios razoáveis de autoria e a demonstração cabal de que a prova não pode ser obtida por outros meios idôneos, exigindo-se ainda que a infração apurada seja apenada com reclusão. De modo análogo, a captação ambiental, introduzida no art. 8º-A pelo Pacote Anticrime, demanda reserva de jurisdição e restringe-se a delitos cujas penas máximas superem quatro anos ou conexos a organizações criminosas.

No tocante à inteligência financeira, o Supremo Tribunal Federal, ao julgar o Tema 990 de Repercussão Geral, assentou a legitimidade do compartilhamento de Relatórios de Inteligência Financeira (RIF) emitidos pelo COAF diretamente com a autoridade policial, prescindindo de autorização judicial, desde que resguardado o sigilo legal.

Por derradeiro, a lavagem de dinheiro, tipificada na Lei nº 9.613/1998, configura tipo penal autônomo em relação à infração antecedente, autorizando a constrição assecuratória imediata de bens e valores para a garantia da eficácia da prestação jurisdicional.`
  },
  {
    id: 'disc-fgv-receita',
    title: 'Limitações ao Poder de Tributar e Não Cumulatividade do ICMS/IBS',
    banca: 'FGV',
    institution: 'Receita Federal do Brasil',
    role: 'Auditor-Fiscal da Receita Federal',
    year: 2026,
    area: 'Fiscal',
    motivatingText: `A Emenda Constitucional da Reforma Tributária reconfigurou as matrizes da tributação sobre o consumo no Brasil, promovendo a transição para o modelo do Imposto sobre Bens e Serviços (IBS) e da Contribuição sobre Bens e Serviços (CBS). Todavia, as premissas estruturais do Sistema Tributário Nacional, em especial os princípios da anterioridade, da legalidade e as imunidades constitucionais objetivas, continuam a nortear a atuação da administração tributária fazendária.`,
    mandatoryTopics: [
      {
        id: 't1',
        description: 'Diferenciação dogmática e prática entre Imunidade Tributária, Isenção e Não Incidência.',
        maxPoints: 3.5
      },
      {
        id: 't2',
        description: 'Aplicação do princípio da não cumulatividade plena e o regime de aproveitamento de créditos fiscais.',
        maxPoints: 3.5
      },
      {
        id: 't3',
        description: 'As limitações constitucionais ao poder de tributar no contexto das transações com ativos digitais e serviços telemáticos.',
        maxPoints: 3.0
      }
    ],
    minLines: 20,
    maxLines: 30,
    officialAnswerModel: `1. O candidato deve esclarecer que a imunidade tributária decorre diretamente do texto constitucional, consubstanciando verdadeira hipótese de incompetência tributária das entidades federativas. A isenção, por sua vez, é hipótese de exclusão do crédito tributário veiculada por lei ordinária da respectiva pessoa política competente (art. 175, I, CTN). A não incidência ocorre quando o fato da vida não se subsume à hipótese de incidência abstrata da norma tributária.
2. Na não cumulatividade, o candidato deve explicitar o mecanismo de compensação do imposto devido em cada operação com o montante cobrado nas anteriores, assegurando que o tributo incida apenas sobre o valor agregado.
3. Deve apontar as diretrizes constitucionais da capacidade contributiva, legalidade estrita e os precedentes do STF quanto à tributação de software e serviços em nuvem.`
  },
  {
    id: 'disc-fcc-trt',
    title: 'Teletrabalho, Vigilância Eletrônica e Direito à Desconexão',
    banca: 'FCC',
    institution: 'Tribunal Regional do Trabalho (TRT)',
    role: 'Analista Judiciário - Área Judiciária',
    year: 2026,
    area: 'Tribunais',
    motivatingText: `A intensificação das modalidades de trabalho remoto e híbrido, acelerada pelas novas tecnologias de informação, redefiniu as fronteiras entre a vida profissional e a intimidade do trabalhador. Discute-se na doutrina juslaboral e na jurisprudência do TST a compatibilização do poder diretivo e fiscalizatório do empregador com as garantias fundamentais da intimidade, da privacidade e da higidez física e mental, emergindo com vigor a teoria do dano existencial pela inobservância do direito à desconexão.`,
    mandatoryTopics: [
      {
        id: 't1',
        description: 'Regulamentação legal do teletrabalho na CLT (arts. 75-A e seguintes) e controle de jornada.',
        maxPoints: 3.5
      },
      {
        id: 't2',
        description: 'Limites constitucionais ao poder fiscalizatório do empregador frente à intimidade e à proteção de dados (LGPD).',
        maxPoints: 3.5
      },
      {
        id: 't3',
        description: 'Configuração do dano existencial decorrente da violação habitual do direito à desconexão.',
        maxPoints: 3.0
      }
    ],
    minLines: 20,
    maxLines: 30,
    officialAnswerModel: `1. O candidato deve analisar as disposições dos arts. 75-A a 75-E da CLT, abordando a formalização por contrato individual escrito, a responsabilidade pela aquisição de equipamentos e o controle de jornada (especialmente após a Lei 14.442/2022).
2. Abordar o conflito entre o poder diretivo do art. 2º da CLT e os direitos fundamentais à privacidade e à intimidade (art. 5º, X, CF), aplicando os princípios da necessidade e adequação da LGPD para proibir o monitoramento invasivo injustificado.
3. Demonstrar que o dano existencial decorre da sobrejornada crônica ou da convocação incessante em períodos de repouso, gerando prejuízo ao projeto de vida e às relações sociais do trabalhador.`
  },
  {
    id: 'disc-oab-seguranca',
    title: 'Mandado de Segurança Coletivo contra Ato Coator de Autoridade Fazendária',
    banca: 'OAB',
    institution: 'Conselho Federal da OAB',
    role: 'Advogado - 2ª Fase Constitucional',
    year: 2026,
    area: 'Jurídica',
    motivatingText: `Determinada associação civil legalmente constituída há 3 anos no Estado de São Paulo, cujos estatutos contemplam expressamente a defesa dos interesses de seus associados comerciantes, toma conhecimento de portaria expedida pelo Secretário de Fazenda Estadual que exigiu taxa manifestamente ilegal para a renovação de licenças operacionais, estipulando prazo improrrogável de 15 dias sob pena de interdição sumária dos estabelecimentos comerciais.`,
    mandatoryTopics: [
      {
        id: 't1',
        description: 'Identificação do cabimento do Mandado de Segurança Coletivo e legitimação ativa da associação (art. 5º, LXX, da CF e Lei 12.016/2009).',
        maxPoints: 3.5
      },
      {
        id: 't2',
        description: 'Competência originária do Tribunal de Justiça para processar e julgar mandado de segurança contra Secretário de Estado.',
        maxPoints: 3.0
      },
      {
        id: 't3',
        description: 'Requisitos para a concessão de liminar inaudita altera parte (fundamento relevante e perigo de ineficácia da medida).',
        maxPoints: 3.5
      }
    ],
    minLines: 20,
    maxLines: 30,
    officialAnswerModel: `1. O examinando deve fundamentar o cabimento do Mandado de Segurança Coletivo com fulcro no art. 5º, LXX, "b", da CF e no art. 21 da Lei nº 12.016/2009. Deve demonstrar que a entidade está constituída há mais de 1 ano e atua em defesa de direitos individuais homogêneos de seus associados, sendo desnecessária autorização nominal específica conforme entendimento vinculante do STF.
2. Deve apontar a autoridade coatora (Secretário da Fazenda do Estado) e a competência originária do Tribunal de Justiça correspondente para o conhecimento da ação mandamental.
3. Demonstrar os requisitos do art. 7º, III, da Lei 12.016/2009: o fumus boni iuris consubstanciado na inconstitucionalidade e ilegalidade da taxa cobrada por mero ato infralegal, e o periculum in mora decorrente da ameaça de interdição dos estabelecimentos em prazo exíguo.`
  }
];

export const MOCK_FULL_EXAMS: MockExam[] = [
  {
    id: 'sim-pf-cebraspe-2026',
    title: 'Simulado Oficial Polícia Federal 2026 — Agente de Polícia',
    banca: 'Cebraspe',
    institution: 'Polícia Federal',
    role: 'Agente de Polícia Federal',
    durationMinutes: 45,
    totalQuestions: 10,
    scoringRule: 'cebraspe_uma_anula_uma',
    estimatedCutoffScore: 68.0,
    description: 'Prova simulada com padrão Cebraspe (Certo / Errado). Cada questão incorreta anula uma questão correta (Nota Líquida = C - E). Respostas em branco não são pontuadas e não geram penalidade.',
    questions: [
      {
        id: 'q-pf-1',
        subjectId: 'sub-dir-penal',
        subjectName: 'Direito Penal',
        topicId: 'top-penal-1',
        topicName: 'Aplicação da Lei Penal no Tempo e Espaço',
        banca: 'Cebraspe',
        year: 2026,
        institution: 'Polícia Federal',
        statement: 'Acerca da aplicação da lei penal no tempo e no espaço, julgue o item a seguir:\n\nA lei penal mais gravosa aplica-se ao crime continuado ou ao crime permanente se a sua vigência for anterior à cessação da continuidade ou da permanência.',
        codeCitation: 'Súmula 711 do STF',
        options: [
          { id: 'opt-c', text: 'CERTO', isCorrect: true },
          { id: 'opt-e', text: 'ERRADO', isCorrect: false, distractorReason: 'O candidato supõe erroneamente que a lei mais gravosa nunca pode retroagir, esquecendo que no crime permanente o delito continua sendo praticado sob a égide da lei nova.' }
        ],
        explanation: 'GABARITO: CERTO. Aplica-se integralmente a Súmula 711 do STF: "A lei penal mais grave aplica-se ao crime continuado ou ao crime permanente, se a sua vigência é anterior à cessação da continuidade ou da permanência". Como o crime continuava ocorrendo sob a nova lei, não há retroatividade in pejus, mas sim aplicação imediata da lei penal vigente durante a conduta criminosa.',
        lawArticles: ['Súmula 711/STF', 'Art. 2º do Código Penal'],
        cognitiveAnalysis: {
          commonTrap: 'Confundir o princípio da irretroatividade da lei penal mais gravosa com a vigência simultânea ao crime permanente.',
          keyConcept: 'Crime permanente e Súmula 711 do STF.',
          bancaTendency: 'O Cebraspe frequentemente cobra a literalidade da Súmula 711 em provas da Polícia Federal e da PRF.'
        }
      },
      {
        id: 'q-pf-2',
        subjectId: 'sub-dir-penal',
        subjectName: 'Direito Penal',
        topicId: 'top-penal-2',
        topicName: 'Teoria do Erro e Ilicitude',
        banca: 'Cebraspe',
        year: 2026,
        institution: 'Polícia Federal',
        statement: 'Julgue o item que se segue, relativo à ilicitude e à culpabilidade:\n\nO erro de proibição inevitável isenta o agente de pena, enquanto o erro de proibição evitável não exclui a culpabilidade, mas autoriza a diminuição da pena de um sexto a um terço.',
        codeCitation: 'Art. 21 do Código Penal',
        options: [
          { id: 'opt-c', text: 'CERTO', isCorrect: true },
          { id: 'opt-e', text: 'ERRADO', isCorrect: false, distractorReason: 'Confundir a consequência do erro sobre elementos do tipo (art. 20) com o erro sobre a ilicitude do fato (art. 21).' }
        ],
        explanation: 'GABARITO: CERTO. Conforme redação estrita do Art. 21 do Código Penal: "O desconhecimento da lei é inescusável. O erro sobre a ilicitude do fato, se inevitável, isenta de pena; se evitável, poderá diminuí-la de um sexto a um terço".',
        lawArticles: ['Art. 21 do Código Penal'],
        cognitiveAnalysis: {
          commonTrap: 'Trocar o efeito do erro de proibição (afeta culpabilidade) pelo erro de tipo (afeta dolo/culpa).',
          keyConcept: 'Erro de Proibição Inevitável vs Evitável.',
          bancaTendency: 'Cobrança do sistema vicariante da culpabilidade adotado pela Reforma da Parte Geral de 1984.'
        }
      },
      {
        id: 'q-pf-3',
        subjectId: 'sub-dir-proc-penal',
        subjectName: 'Direito Processual Penal',
        topicId: 'top-proc-1',
        topicName: 'Inquérito Policial e Notitia Criminis',
        banca: 'Cebraspe',
        year: 2026,
        institution: 'Polícia Federal',
        statement: 'No que concerne ao inquérito policial e à ação penal, julgue o item subsequente:\n\nEm razão do princípio da indisponibilidade que rege o inquérito policial, a autoridade policial não poderá determinar o arquivamento dos autos de inquérito, competindo tal prerrogativa privativamente à autoridade judiciária competente, precedida de manifestação ministerial.',
        codeCitation: 'Art. 17 do Código de Processo Penal',
        options: [
          { id: 'opt-c', text: 'CERTO', isCorrect: true },
          { id: 'opt-e', text: 'ERRADO', isCorrect: false, distractorReason: 'Acreditar que diante de atipicidade manifesta o delegado de polícia pode arquivar diretamente os autos em cartório.' }
        ],
        explanation: 'GABARITO: CERTO. O art. 17 do Código de Processo Penal estabelece expressamente: "A autoridade policial não poderá mandar arquivar autos de inquérito". O arquivamento é ato complexo dependente do Ministério Público e de homologação judicial (art. 28 do CPP).',
        lawArticles: ['Art. 17 do CPP', 'Art. 28 do CPP'],
        cognitiveAnalysis: {
          commonTrap: 'Supor exceções de arquivamento direto pelo delegado em casos de excludente de ilicitude cabal.',
          keyConcept: 'Princípio da Indisponibilidade do Inquérito Policial.',
          bancaTendency: 'Questão recorrente para cargos de Agente e Escrivão da PF.'
        }
      },
      {
        id: 'q-pf-4',
        subjectId: 'sub-dir-proc-penal',
        subjectName: 'Direito Processual Penal',
        topicId: 'top-proc-2',
        topicName: 'Prisão em Flagrante e Liberdade Provisória',
        banca: 'Cebraspe',
        year: 2026,
        institution: 'Polícia Federal',
        statement: 'Julgue o item relativo às medidas cautelares pessoais:\n\nConsidera-se flagrante impróprio (ou quase-flagrante) a hipótese em que o indivíduo é surpreendido cometendo a infração penal ou acaba de cometê-la no exato local dos fatos.',
        codeCitation: 'Art. 302 do CPP',
        options: [
          { id: 'opt-c', text: 'CERTO', isCorrect: false, distractorReason: 'Confundir o flagrante próprio (incisos I e II) com o flagrante impróprio (inciso III).' },
          { id: 'opt-e', text: 'ERRADO', isCorrect: true }
        ],
        explanation: 'GABARITO: ERRADO. A situação narrada ("cometendo ou acaba de cometê-la") configura flagrante PRÓPRIO ou real (art. 302, incisos I e II, do CPP). O flagrante IMPRÓPRIO (ou quase-flagrante, art. 302, III) é aquele em que o agente é PERSEGUIDO, logo após, pela autoridade, pelo ofendido ou por qualquer pessoa, em situação que faça presumir ser ele o autor da infração.',
        lawArticles: ['Art. 302, I, II e III do CPP'],
        cognitiveAnalysis: {
          commonTrap: 'Inversão dos conceitos clássicos das espécies de flagrante do art. 302 do CPP.',
          keyConcept: 'Classificação dogmática do Flagrante Próprio vs Impróprio vs Presumido.',
          bancaTendency: 'O Cebraspe frequentemente troca as denominações doutrinárias dos incisos do art. 302.'
        }
      },
      {
        id: 'q-pf-5',
        subjectId: 'sub-leg-especial',
        subjectName: 'Legislação Especial',
        topicId: 'top-leg-1',
        topicName: 'Lei das Organizações Criminosas (Lei 12.850/13)',
        banca: 'Cebraspe',
        year: 2026,
        institution: 'Polícia Federal',
        statement: 'A respeito da colaboração premiada e da infiltração policial segundo a Lei nº 12.850/2013, julgue o item:\n\nO juiz não participará das negociações realizadas entre as partes para a formalização do acordo de colaboração premiada, devendo exercer o controle judicial de legalidade e voluntariedade na audiência de homologação.',
        codeCitation: 'Art. 4º, § 6º da Lei 12.850/13',
        options: [
          { id: 'opt-c', text: 'CERTO', isCorrect: true },
          { id: 'opt-e', text: 'ERRADO', isCorrect: false, distractorReason: 'Imaginar que o juiz das garantias ou magistrado instrutor pode sugerir benefícios premiais nas rodadas de negociação.' }
        ],
        explanation: 'GABARITO: CERTO. Conforme o art. 4º, § 6º, da Lei nº 12.850/2013: "O juiz não participará das negociações realizadas entre as partes para a formalização do acordo de colaboração, que ocorrerá entre o delegado de polícia, o investigado e o defensor, com a manifestação do Ministério Público, ou, conforme o caso, entre o Ministério Público e o investigado ou acusado e seu defensor". A atuação judicial é estritamente homologatória e fiscalizatória.',
        lawArticles: ['Art. 4º, § 6º da Lei 12.850/13'],
        cognitiveAnalysis: {
          commonTrap: 'Confundir homologação judicial com intervenção negocial direta do magistrado.',
          keyConcept: 'Sistema Acusatório e Separação de Funções na Colaboração Premiada.',
          bancaTendency: 'Tema consolidado e cobrado com ênfase na preservação da imparcialidade do julgador.'
        }
      },
      {
        id: 'q-pf-6',
        subjectId: 'sub-dir-adm',
        subjectName: 'Direito Administrativo',
        topicId: 'top-adm-1',
        topicName: 'Regime Disciplinar (Lei 8.112/90)',
        banca: 'Cebraspe',
        year: 2026,
        institution: 'Polícia Federal',
        statement: 'Julgue o item a seguir com base no regime dos servidores públicos federais (Lei nº 8.112/1990):\n\nA demissão do servidor público federal em razão de improbidade administrativa, aplicação irregular de dinheiros públicos ou lesão aos cofres públicos e dilapidação do patrimônio nacional acarreta a indisponibilidade dos seus bens e o ressarcimento ao erário, sem prejuízo da ação penal cabível.',
        codeCitation: 'Art. 136 da Lei 8.112/90',
        options: [
          { id: 'opt-c', text: 'CERTO', isCorrect: true },
          { id: 'opt-e', text: 'ERRADO', isCorrect: false, distractorReason: 'Achar que a esfera administrativa não pode fixar a comunicação de indisponibilidade dos bens.' }
        ],
        explanation: 'GABARITO: CERTO. O art. 136 da Lei nº 8.112/1990 estatui textualmente: "A demissão ou a destituição de cargo em comissão, nos casos dos incisos IV, VIII, X e XI do art. 132, implica a indisponibilidade dos bens e o ressarcimento ao erário, sem prejuízo da ação penal cabível".',
        lawArticles: ['Art. 136 da Lei 8.112/90', 'Art. 132 da Lei 8.112/90'],
        cognitiveAnalysis: {
          commonTrap: 'Ignorar os efeitos patrimoniais decorrentes da demissão qualificada na Lei 8.112/90.',
          keyConcept: 'Efeitos da demissão por ilícitos gravosos na Administração Pública.',
          bancaTendency: 'Cobrança da literalidade dos dispositivos de regime disciplinar.'
        }
      },
      {
        id: 'q-pf-7',
        subjectId: 'sub-dir-adm',
        subjectName: 'Direito Administrativo',
        topicId: 'top-adm-2',
        topicName: 'Nova Lei de Improbidade Administrativa (Lei 14.230/21)',
        banca: 'Cebraspe',
        year: 2026,
        institution: 'Polícia Federal',
        statement: 'Acerca da Lei de Improbidade Administrativa reformada, julgue o item:\n\nA configuração de ato de improbidade administrativa causador de prejuízo ao erário independe de demonstração de dolo específico, bastando a constatação de culpa grave ou negligência inescusável do agente público no manejo de verbas orçamentárias.',
        codeCitation: 'Art. 1º e Art. 10 da Lei 8.429/92 reformada',
        options: [
          { id: 'opt-c', text: 'CERTO', isCorrect: false, distractorReason: 'Lembrar da redação antiga anterior a 2021, que admitia improbidade culposa no art. 10.' },
          { id: 'opt-e', text: 'ERRADO', isCorrect: true }
        ],
        explanation: 'GABARITO: ERRADO. Com o advento da Lei nº 14.230/2021, foi expressamente EXTINTA a figura da improbidade administrativa na modalidade culposa. O art. 1º, §§ 1º e 2º, e o art. 10 da Lei 8.429/92 passaram a exigir a presença de DOLO ESPECÍFICO (vontade livre e consciente de alcançar o resultado ilícito), não sendo mais punível a mera culpa, ainda que grave.',
        lawArticles: ['Art. 1º, §§ 1º e 2º da Lei 8.429/92', 'Lei 14.230/2021'],
        cognitiveAnalysis: {
          commonTrap: 'Aplicar jurisprudência ou texto anterior à reforma da Lei 14.230/2021.',
          keyConcept: 'Exigência universal de dolo específico nos atos de improbidade.',
          bancaTendency: 'Tema com altíssima taxa de cobrança recente por todas as bancas.'
        }
      },
      {
        id: 'q-pf-8',
        subjectId: 'sub-dir-const',
        subjectName: 'Direito Constitucional',
        topicId: 'top-const-1',
        topicName: 'Inviolabilidade de Domicílio',
        banca: 'Cebraspe',
        year: 2026,
        institution: 'Polícia Federal',
        statement: 'Com relação aos direitos e garantias fundamentais insculpidos na CF/88, julgue o item:\n\nA entrada forçada em domicílio sem mandado judicial, mesmo em período noturno, é lícita quando amparada em fundadas razões, devidamente justificadas a posteriori, que indiquem que dentro da casa ocorre situação de flagrante delito de crime permanente.',
        codeCitation: 'Tema 280 da Repercussão Geral do STF',
        options: [
          { id: 'opt-c', text: 'CERTO', isCorrect: true },
          { id: 'opt-e', text: 'ERRADO', isCorrect: false, distractorReason: 'Considerar que durante a noite a entrada em domicílio JAMAIS pode ocorrer sem mandado judicial escrito.' }
        ],
        explanation: 'GABARITO: CERTO. O STF fixou tese vinculante no Tema 280 da Repercussão Geral (RE 603.616): "A entrada forçada em domicílio sem mandado judicial só é lícita, mesmo em período noturno, quando amparada em fundadas razões, devidamente justificadas a posteriori, que indiquem que dentro da casa ocorre situação de flagrante delito, sob pena de responsabilidade disciplinar, civil e penal do agente ou da autoridade e de nulidade dos atos praticados".',
        lawArticles: ['Art. 5º, XI da CF/88', 'Tema 280/STF'],
        cognitiveAnalysis: {
          commonTrap: 'Não atentar para as ressalvas do art. 5º, XI da CF (flagrante delito, desastre ou socorro admitem entrada a qualquer hora).',
          keyConcept: 'Inviolabilidade domiciliar e fundadas razões (justificativa a posteriori).',
          bancaTendency: 'Questão clássica da carreira policial.'
        }
      },
      {
        id: 'q-pf-9',
        subjectId: 'sub-informatica',
        subjectName: 'Informática e Segurança',
        topicId: 'top-info-1',
        topicName: 'Criptografia e Assinatura Digital',
        banca: 'Cebraspe',
        year: 2026,
        institution: 'Polícia Federal',
        statement: 'No âmbito da segurança da informação e da perícia forense digital, julgue o item subsequente:\n\nEm um esquema de criptografia assimétrica, para que o remetente garanta a autenticidade e o não repúdio de uma mensagem enviada a um policial federal, ele deve cifrar a mensagem utilizando a chave pública do destinatário.',
        codeCitation: 'Fundamentos de Criptografia Assimétrica (ICP-Brasil)',
        options: [
          { id: 'opt-c', text: 'CERTO', isCorrect: false, distractorReason: 'Confundir garantia de confidencialidade (cifra com chave pública do destinatário) com garantia de autenticidade/não repúdio (cifra com chave privada do remetente).' },
          { id: 'opt-e', text: 'ERRADO', isCorrect: true }
        ],
        explanation: 'GABARITO: ERRADO. Para garantir AUTENTICIDADE e NÃO REPÚDIO (assinatura digital), o remetente cifra o hash da mensagem com sua própria CHAVE PRIVADA (que só ele possui). Cifrar com a chave pública do destinatário garante apenas a CONFIDENCIALIDADE (apenas o destinatário com sua chave privada conseguirá decifrar), mas qualquer pessoa que tenha a chave pública do destinatário poderia ter criado a mensagem.',
        lawArticles: ['Medida Provisória 2.200-2/2001 (ICP-Brasil)'],
        cognitiveAnalysis: {
          commonTrap: 'Inversão do papel das chaves pública e privada na garantia de confidencialidade versus autenticidade.',
          keyConcept: 'Criptografia Assimétrica: Confidencialidade vs Assinatura Digital.',
          bancaTendency: 'O Cebraspe explora intensamente a distinção entre chave pública e privada na prova da PF.'
        }
      },
      {
        id: 'q-pf-10',
        subjectId: 'sub-dir-penal',
        subjectName: 'Direito Penal',
        topicId: 'top-penal-3',
        topicName: 'Crimes Contra a Administração Pública',
        banca: 'Cebraspe',
        year: 2026,
        institution: 'Polícia Federal',
        statement: 'Julgue o item no tocante aos crimes praticados por funcionário público contra a administração em geral:\n\nO servidor público que exige, para si ou para outrem, direta ou indiretamente, ainda que fora da função ou antes de assumi-la, mas em razão dela, vantagem indevida comete o crime de corrupção passiva consumado no momento da efetiva entrega do numerário.',
        codeCitation: 'Art. 316 e Art. 317 do Código Penal',
        options: [
          { id: 'opt-c', text: 'CERTO', isCorrect: false, distractorReason: 'Confundir o verbo "exigir" (concussão) com "solicitar/receber" (corrupção passiva) e errar a consumação (crime formal que não exige a entrega).' },
          { id: 'opt-e', text: 'ERRADO', isCorrect: true }
        ],
        explanation: 'GABARITO: ERRADO. O item contém dois erros crassos: 1) O verbo "exigir" configura o crime de CONCUSSÃO (art. 316 do CP), e não corrupção passiva (art. 317, cujo núcleo é "solicitar ou receber"). 2) Trata-se de crime formal (de consumação antecipada), consumando-se no exato instante em que a exigência chega ao conhecimento da vítima, sendo a entrega da vantagem mero exaurimento do delito.',
        lawArticles: ['Art. 316 do Código Penal', 'Art. 317 do Código Penal'],
        cognitiveAnalysis: {
          commonTrap: 'Troca clássica entre o tipo da concussão (exigir) e da corrupção passiva (solicitar/receber) associada à natureza formal do delito.',
          keyConcept: 'Diferenciação Concussão vs Corrupção Passiva e momento consumativo.',
          bancaTendency: 'Pegadinha predileta das bancas em Direito Penal administrativo.'
        }
      }
    ]
  },
  {
    id: 'sim-receita-fgv-2026',
    title: 'Simulado Oficial Receita Federal 2026 — Auditor-Fiscal',
    banca: 'FGV',
    institution: 'Receita Federal do Brasil',
    role: 'Auditor-Fiscal da Receita Federal',
    durationMinutes: 45,
    totalQuestions: 5,
    scoringRule: 'multipla_escolha_ponderada',
    estimatedCutoffScore: 72.0,
    description: 'Prova simulada no modelo FGV (5 alternativas A a E). Questões analíticas com casos hipotéticos práticos, ponderação de pontos por matéria e sem penalidade de anulação.',
    questions: [
      {
        id: 'q-fgv-1',
        subjectId: 'sub-dir-trib',
        subjectName: 'Direito Tributário',
        topicId: 'top-trib-1',
        topicName: 'Crédito Tributário e Suspensão da Exigibilidade',
        banca: 'FGV',
        year: 2026,
        institution: 'Receita Federal',
        statement: 'A sociedade empresária Alfa foi autuada pela Receita Federal em razão de suposto recolhimento a menor de IRPJ. Inconformada, a contribuinte ajuizou Ação Anulatória de Débito Fiscal desacompanhada de depósito do montante integral e sem pedido de tutela de urgência.\n\nNessa hipótese, de acordo com o Código Tributário Nacional e a jurisprudência sumulada do STJ, é correto afirmar que o ajuizamento da ação ordinária anulatória:',
        codeCitation: 'Art. 151 do CTN e Súmula 112 do STJ',
        options: [
          { id: 'opt-a', text: 'Suspende automaticamente a exigibilidade do crédito tributário em decorrência da garantia constitucional do livre acesso à Justiça.', isCorrect: false },
          { id: 'opt-b', text: 'Não suspende a exigibilidade do crédito tributário, permitindo que a Fazenda Pública promova a inscrição em dívida ativa e a respectiva execução fiscal.', isCorrect: true },
          { id: 'opt-c', text: 'Extingue o crédito tributário caso o contribuinte ofereça bens imóveis em caução fidejussória preliminar.', isCorrect: false },
          { id: 'opt-d', text: 'Impede a prática de atos executivos, mas autoriza a cobrança de multa moratória progressiva.', isCorrect: false },
          { id: 'opt-e', text: 'Exige caução idônea de 50% do valor do débito para impedir a lavratura da certidão positiva com efeito de negativa.', isCorrect: false }
        ],
        explanation: 'GABARITO: B. Conforme o art. 151 do CTN, as causas de suspensão da exigibilidade do crédito tributário são taxativas (moratória, depósito integral e em dinheiro, reclamações e recursos administrativos, liminar em mandado de segurança, tutela provisória em ação ordinária e parcelamento). O mero ajuizamento de ação anulatória, sem depósito integral em dinheiro (Súmula 112/STJ) nem concessão de liminar/tutela, NÃO suspende a exigibilidade do crédito tributário nem obsta a propositura de execução fiscal.',
        lawArticles: ['Art. 151 do CTN', 'Súmula 112 do STJ'],
        cognitiveAnalysis: {
          commonTrap: 'Achar que a simples judicialização do débito obsta a cobrança fazendária.',
          keyConcept: 'Taxatividade das hipóteses do Art. 151 do CTN e Súmula 112/STJ.',
          bancaTendency: 'A FGV costuma criar casos hipotéticos empresariais para testar a mecânica do CTN.'
        }
      },
      {
        id: 'q-fgv-2',
        subjectId: 'sub-dir-trib',
        subjectName: 'Direito Tributário',
        topicId: 'top-trib-2',
        topicName: 'Imunidades Constitucionais e Livros Eletrônicos',
        banca: 'FGV',
        year: 2026,
        institution: 'Receita Federal',
        statement: 'Determinada livraria comercializa leitores de livros digitais (e-readers) exclusivamente destinados à leitura de obras eletrônicas e destituídos de qualquer outra funcionalidade acessória, como navegação irrestrita na internet ou reprodução de vídeos.\n\nÀ luz da jurisprudência vinculante do Supremo Tribunal Federal (Súmula Vinculante 57), a imunidade cultural do art. 150, VI, "d", da Constituição Federal:',
        codeCitation: 'Súmula Vinculante 57 do STF',
        options: [
          { id: 'opt-a', text: 'Alcança os livros eletrônicos e os suportes materiais exclusivamente utilizados para fixá-los, abrangendo o referido e-reader.', isCorrect: true },
          { id: 'opt-b', text: 'Restringe-se ao livro em formato de papel físico, sendo inaplicável a dispositivos telemáticos de qualquer natureza.', isCorrect: false },
          { id: 'opt-c', text: 'Beneficia apenas o conteúdo imaterial dos e-books, incidindo integralmente sobre qualquer hardware ou suporte leitor.', isCorrect: false },
          { id: 'opt-d', text: 'Aplica-se unicamente a livros didáticos e periódicos científicos, vedada a extensão a obras literárias de ficção.', isCorrect: false },
          { id: 'opt-e', text: 'Depende de lei complementar federal regulamentadora dos padrões de interoperabilidade técnica do leitor.', isCorrect: false }
        ],
        explanation: 'GABARITO: A. Aplica-se a Súmula Vinculante 57 do STF: "A imunidade tributária constante do art. 150, VI, \'d\', da CF/88 aplica-se à importação e à comercialização, no mercado interno, do livro eletrônico (e-book) e dos suportes exclusivamente utilizados para fixá-los, como leitores de livros eletrônicos (e-readers), ainda que possuam funcionalidades acessórias".',
        lawArticles: ['Súmula Vinculante 57', 'Art. 150, VI, "d" da CF/88'],
        cognitiveAnalysis: {
          commonTrap: 'Assumir que a imunidade de imprensa/cultural jamais se estende aos componentes de hardware.',
          keyConcept: 'Imunidade cultural e interpretação teleológica e evolutiva da CF.',
          bancaTendency: 'Cobrança reiterada de Súmulas Vinculantes em provas da área fiscal da FGV.'
        }
      },
      {
        id: 'q-fgv-3',
        subjectId: 'sub-dir-adm',
        subjectName: 'Direito Administrativo',
        topicId: 'top-adm-3',
        topicName: 'Nova Lei de Licitações (Lei 14.133/2021)',
        banca: 'FGV',
        year: 2026,
        institution: 'Receita Federal',
        statement: 'Órgão público federal necessita contratar serviço técnico especializado de natureza predominantemente intelectual, prestado por profissional de notória especialização, para a estruturação de parecer jurídico sobre matéria tributária inédita e de alta complexidade.\n\nDe acordo com a Nova Lei de Licitações e Contratos Administrativos (Lei nº 14.133/2021), a referida contratação deve ocorrer mediante:',
        codeCitation: 'Art. 74, III, da Lei 14.133/2021',
        options: [
          { id: 'opt-a', text: 'Dispensa de licitação em razão do valor estimado reduzido.', isCorrect: false },
          { id: 'opt-b', text: 'Inexigibilidade de licitação, tendo em vista a inviabilidade de competição decorrente da singularidade e notória especialização.', isCorrect: true },
          { id: 'opt-c', text: 'Pregão eletrônico obrigatório, por se tratar de prestação de serviços intelectuais comuns.', isCorrect: false },
          { id: 'opt-d', text: 'Concurso de projetos com premiação pecuniária ao primeiro colocado.', isCorrect: false },
          { id: 'opt-e', text: 'Diálogo competitivo para negociação de minutas com múltiplos juristas cadastrados.', isCorrect: false }
        ],
        explanation: 'GABARITO: B. O art. 74, III, "a", da Lei nº 14.133/2021 prevê a hipótese de INEXIGIBILIDADE de licitação para contratação de serviços técnicos especializados de natureza predominantemente intelectual com profissionais ou empresas de notória especialização, vedada a inexigibilidade para serviços de publicidade e divulgação.',
        lawArticles: ['Art. 74, inciso III da Lei 14.133/2021'],
        cognitiveAnalysis: {
          commonTrap: 'Confundir as hipóteses de Dispensa (art. 75) com Inexigibilidade (art. 74).',
          keyConcept: 'Inviabilidade de competição em serviços técnicos singulares.',
          bancaTendency: 'A FGV exige precisão na distinção entre dispensa e inexigibilidade na Lei 14.133.'
        }
      },
      {
        id: 'q-fgv-4',
        subjectId: 'sub-dir-const',
        subjectName: 'Direito Constitucional',
        topicId: 'top-const-2',
        topicName: 'Controle de Constitucionalidade e Cláusula de Reserva de Plenário',
        banca: 'FGV',
        year: 2026,
        institution: 'Receita Federal',
        statement: 'Órgão fracionário (Turma ou Câmara) de Tribunal Regional Federal, ao julgar apelação cível, afasta expressamente a incidência de dispositivo de lei federal com base em alegação de incompatibilidade com a Constituição da República, sem prévia submissão do tema ao Plenário ou Órgão Especial do respectivo tribunal.\n\nNesse cenário, conforme a jurisprudência sumulada do Supremo Tribunal Federal (Súmula Vinculante 10), a referida decisão:',
        codeCitation: 'Súmula Vinculante 10 e Art. 97 da CF/88',
        options: [
          { id: 'opt-a', text: 'É plenamente válida, pois aos órgãos fracionários é outorgada competência difusa irrestrita para anular atos normativos inconstitucionais.', isCorrect: false },
          { id: 'opt-b', text: 'Viola a cláusula de reserva de plenário (art. 97 da CF), que veda a declaração de inconstitucionalidade ou o afastamento do preceito legal por órgão fracionário.', isCorrect: true },
          { id: 'opt-c', text: 'Gera preclusão pro judicato imediata, ensejando apenas arguição de descumprimento de preceito fundamental.', isCorrect: false },
          { id: 'opt-d', text: 'Pode ser convalidada pelo relator mediante decisão monocrática de natureza declaratória.', isCorrect: false },
          { id: 'opt-e', text: 'Apenas configuraria vício se o Ministério Público Federal houvesse opinado contrariamente no parecer de mérito.', isCorrect: false }
        ],
        explanation: 'GABARITO: B. A Súmula Vinculante 10 do STF estabelece: "Viola a cláusula de reserva de plenário (CF, artigo 97) a decisão de órgão fracionário de Tribunal que, embora não declare expressamente a inconstitucionalidade de lei ou ato normativo do poder público, afasta sua incidência, no todo ou em parte".',
        lawArticles: ['Súmula Vinculante 10', 'Art. 97 da CF/88'],
        cognitiveAnalysis: {
          commonTrap: 'Imaginar que não declarar inconstitucionalidade na ementa autoriza afastar a incidência da norma.',
          keyConcept: 'Cláusula de Reserva de Plenário (Full Bench Rule).',
          bancaTendency: 'Tema recorrente e consolidado nos concursos de alto nível.'
        }
      },
      {
        id: 'q-fgv-5',
        subjectId: 'sub-dir-trib',
        subjectName: 'Direito Tributário',
        topicId: 'top-trib-3',
        topicName: 'Decadência e Lançamento por Homologação',
        banca: 'FGV',
        year: 2026,
        institution: 'Receita Federal',
        statement: 'No lançamento por homologação de tributo federal, o contribuinte antecipou o pagamento parcial do valor devido, sem a ocorrência de dolo, fraude ou simulação. O Fisco pretende efetuar lançamento de ofício suplementar para cobrar a diferença não recolhida.\n\nSegundo o art. 150, § 4º, do Código Tributário Nacional e a jurisprudência pacificada pelo STJ (Tema Repetitivo 163), o prazo decadencial de 5 anos para o Fisco agir inicia-se:',
        codeCitation: 'Art. 150, § 4º do CTN e Tema 163/STJ',
        options: [
          { id: 'opt-a', text: 'No primeiro dia do exercício seguinte àquele em que o lançamento poderia ter sido efetuado.', isCorrect: false },
          { id: 'opt-b', text: 'Na data da ocorrência do respectivo fato gerador tributário.', isCorrect: true },
          { id: 'opt-c', text: 'No momento da entrega da declaração fiscal eletrônica pelo contribuinte.', isCorrect: false },
          { id: 'opt-d', text: 'A partir da lavratura do termo de distribuição do procedimento fiscalizatório.', isCorrect: false },
          { id: 'opt-e', text: 'No encerramento do exercício financeiro em que ocorreu o pagamento a menor.', isCorrect: false }
        ],
        explanation: 'GABARITO: B. Conforme assentado no Tema 163/STJ (REsp 973.733/SC): havendo pagamento antecipado (ainda que parcial) e inexistindo dolo, fraude ou simulação, aplica-se a regra específica do art. 150, § 4º, do CTN, segundo a qual o prazo decadencial de 5 anos conta-se DA DATA DA OCORRÊNCIA DO FATO GERADOR. A regra geral do art. 173, I, do CTN (primeiro dia do exercício seguinte) só se aplica quando não houver qualquer pagamento antecipado ou em caso de fraude/simulação comprovada.',
        lawArticles: ['Art. 150, § 4º do CTN', 'Tema Repetitivo 163/STJ', 'Art. 173, I do CTN'],
        cognitiveAnalysis: {
          commonTrap: 'Aplicar a regra do art. 173, I (1º dia do exercício seguinte) mesmo quando houve pagamento antecipado parcial.',
          keyConcept: 'Termo a quo da decadência tributária no lançamento por homologação com recolhimento antecipado.',
          bancaTendency: 'Questão indispensável para o cargo de Auditor-Fiscal da Receita Federal.'
        }
      }
    ]
  }
];

export const INITIAL_MISTAKES: MistakeEntry[] = [
  {
    id: 'mistake-1',
    question: {
      id: 'q-pf-7',
      subjectId: 'sub-dir-adm',
      subjectName: 'Direito Administrativo',
      topicId: 'top-adm-2',
      topicName: 'Nova Lei de Improbidade Administrativa (Lei 14.230/21)',
      banca: 'Cebraspe',
      year: 2026,
      institution: 'Polícia Federal',
      statement: 'Acerca da Lei de Improbidade Administrativa reformada, julgue o item:\n\nA configuração de ato de improbidade administrativa causador de prejuízo ao erário independe de demonstração de dolo específico, bastando a constatação de culpa grave ou negligência inescusável do agente público no manejo de verbas orçamentárias.',
      codeCitation: 'Art. 1º e Art. 10 da Lei 8.429/92 reformada',
      options: [
        { id: 'opt-c', text: 'CERTO', isCorrect: false, distractorReason: 'Lembrar da redação antiga anterior a 2021, que admitia improbidade culposa no art. 10.' },
        { id: 'opt-e', text: 'ERRADO', isCorrect: true }
      ],
      explanation: 'GABARITO: ERRADO. Com o advento da Lei nº 14.230/2021, foi expressamente EXTINTA a figura da improbidade administrativa na modalidade culposa. O art. 1º, §§ 1º e 2º, e o art. 10 da Lei 8.429/92 passaram a exigir a presença de DOLO ESPECÍFICO.',
      lawArticles: ['Art. 1º, §§ 1º e 2º da Lei 8.429/92', 'Lei 14.230/2021'],
      cognitiveAnalysis: {
        commonTrap: 'Aplicar jurisprudência ou texto anterior à reforma da Lei 14.230/2021.',
        keyConcept: 'Exigência universal de dolo específico nos atos de improbidade.',
        bancaTendency: 'Tema com altíssima taxa de cobrança recente por todas as bancas.'
      }
    },
    attemptDate: '2026-09-03',
    userSelectedOptionId: 'opt-c',
    errorType: 'pegadinha_banca',
    confidenceLevel: 'alta',
    feedback: 'Você caiu na armadilha clássica do direito transitório. A Lei 14.230/21 revogou a modalidade culposa em toda a LIA.',
    actionableAdvice: 'Memorize: Não existe mais improbidade por culpa no Brasil (nem mesmo culpa grave). Apenas dolo específico.',
    userPersonalNote: 'Atenção redobrada na prova! Sempre que falar em negligência ou culpa grave em improbidade, o item está ERRADO.',
    isOvercome: false,
    revancheAttemptsCount: 0
  },
  {
    id: 'mistake-2',
    question: {
      id: 'q-pf-9',
      subjectId: 'sub-informatica',
      subjectName: 'Informática e Segurança',
      topicId: 'top-info-1',
      topicName: 'Criptografia e Assinatura Digital',
      banca: 'Cebraspe',
      year: 2026,
      institution: 'Polícia Federal',
      statement: 'No âmbito da segurança da informação e da perícia forense digital, julgue o item subsequente:\n\nEm um esquema de criptografia assimétrica, para que o remetente garanta a autenticidade e o não repúdio de uma mensagem enviada a um policial federal, ele deve cifrar a mensagem utilizando a chave pública do destinatário.',
      codeCitation: 'Fundamentos de Criptografia Assimétrica (ICP-Brasil)',
      options: [
        { id: 'opt-c', text: 'CERTO', isCorrect: false, distractorReason: 'Confundir confidencialidade com autenticidade/não repúdio.' },
        { id: 'opt-e', text: 'ERRADO', isCorrect: true }
      ],
      explanation: 'GABARITO: ERRADO. Para garantir AUTENTICIDADE e NÃO REPÚDIO (assinatura digital), o remetente cifra com sua própria CHAVE PRIVADA.',
      lawArticles: ['Medida Provisória 2.200-2/2001 (ICP-Brasil)'],
      cognitiveAnalysis: {
        commonTrap: 'Inversão do papel das chaves pública e privada na garantia de confidencialidade versus autenticidade.',
        keyConcept: 'Criptografia Assimétrica: Confidencialidade vs Assinatura Digital.',
        bancaTendency: 'O Cebraspe explora intensamente a distinção entre chave pública e privada na prova da PF.'
      }
    },
    attemptDate: '2026-09-02',
    userSelectedOptionId: 'opt-c',
    errorType: 'lacuna_teorica',
    confidenceLevel: 'media',
    feedback: 'Confundiu confidencialidade (chave pública do destinatário) com autenticidade/não repúdio (chave privada do remetente).',
    actionableAdvice: 'Mnemônico: Cifra com Privada = Prova quem sou (Assinatura). Cifra com Pública = Só você lê (Sigilo).',
    userPersonalNote: 'Chave PRIVADA do remetente = Assinatura Digital / Autenticidade / Não-repúdio!',
    isOvercome: false,
    revancheAttemptsCount: 0
  },
  {
    id: 'mistake-3',
    question: {
      id: 'q-pf-10',
      subjectId: 'sub-dir-penal',
      subjectName: 'Direito Penal',
      topicId: 'top-penal-3',
      topicName: 'Crimes Contra a Administração Pública',
      banca: 'Cebraspe',
      year: 2026,
      institution: 'Polícia Federal',
      statement: 'Julgue o item no tocante aos crimes praticados por funcionário público contra a administração em geral:\n\nO servidor público que exige, para si ou para outrem, direta ou indiretamente, ainda que fora da função ou antes de assumi-la, mas em razão dela, vantagem indevida comete o crime de corrupção passiva consumado no momento da efetiva entrega do numerário.',
      codeCitation: 'Art. 316 e Art. 317 do Código Penal',
      options: [
        { id: 'opt-c', text: 'CERTO', isCorrect: false, distractorReason: 'Confundir o verbo "exigir" com "solicitar" e errar o momento consumativo.' },
        { id: 'opt-e', text: 'ERRADO', isCorrect: true }
      ],
      explanation: 'GABARITO: ERRADO. O verbo "exigir" configura CONCUSSÃO (art. 316). Além disso, trata-se de crime formal consumado com a mera exigência.',
      lawArticles: ['Art. 316 do Código Penal', 'Art. 317 do Código Penal'],
      cognitiveAnalysis: {
        commonTrap: 'Troca clássica entre o tipo da concussão (exigir) e da corrupção passiva (solicitar/receber).',
        keyConcept: 'Diferenciação Concussão vs Corrupção Passiva e momento consumativo.',
        bancaTendency: 'Pegadinha predileta das bancas em Direito Penal administrativo.'
      }
    },
    attemptDate: '2026-09-01',
    userSelectedOptionId: 'opt-c',
    errorType: 'leitura_apressada',
    confidenceLevel: 'alta',
    feedback: 'Leu rápido e passou batido pelo verbo EXIGIR (concussão) e pela alegação de que consuma apenas com a entrega.',
    actionableAdvice: 'Sempre sublinhe o verbo nuclear do tipo penal antes de marcar a resposta.',
    userPersonalNote: 'EXIGIR = Concussão. SOLICITAR/RECEBER = Corrupção Passiva. Não errar mais isso!',
    isOvercome: false,
    revancheAttemptsCount: 0
  }
];

export const INITIAL_VADE_MECUM: VadeMecumArticle[] = [
  {
    id: 'vm-cf-5-xi',
    diploma: 'CF/88',
    numberStr: 'Art. 5º, inciso XI',
    title: 'Inviolabilidade do Domicílio e Exceções Constitucionais',
    text: 'A casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador, salvo em caso de flagrante delito ou desastre, ou para prestar socorro, ou, durante o dia, por determinação judicial.',
    incidence: 'Alta',
    trapKeywords: ['salvo', 'durante o dia', 'determinação judicial', 'flagrante delito'],
    bancaTrapNote: 'Pegadinha Cebraspe/FGV: A banca diz que "com mandado judicial pode entrar a qualquer hora". Falso! Mandado judicial SOMENTE DURANTE O DIA. Flagrante, desastre e socorro valem de dia e de noite.',
    relatedQuestionId: 'q-pf-8',
    tags: ['Direito Constitucional', 'Direitos Fundamentais', 'Policial', 'OAB']
  },
  {
    id: 'vm-cf-37-caput',
    diploma: 'CF/88',
    numberStr: 'Art. 37, caput',
    title: 'Princípios Expressos da Administração Pública (LIMPE)',
    text: 'A administração pública direta e indireta de qualquer dos Poderes da União, dos Estados, do Distrito Federal e dos Municípios obedecerá aos princípios de legalidade, impessoalidade, moralidade, publicidade e eficiência.',
    incidence: 'Alta',
    trapKeywords: ['legalidade', 'impessoalidade', 'moralidade', 'publicidade', 'eficiência', 'direta e indireta'],
    bancaTrapNote: 'A eficiência foi incluída pela EC 19/98 (não estava na redação original). Bancas tentam colocar "supremacia do interesse público" ou "proporcionalidade" como expressos, mas eles são implícitos.',
    tags: ['Direito Administrativo', 'Direito Constitucional', 'Geral']
  },
  {
    id: 'vm-cf-37-par4',
    diploma: 'CF/88',
    numberStr: 'Art. 37, § 4º',
    title: 'Sanções Constitucionais por Improbidade Administrativa',
    text: 'Os atos de improbidade administrativa importarão a suspensão dos direitos políticos, a perda da função pública, a indisponibilidade dos bens e o ressarcimento ao erário, na forma e gradação previstas em lei, sem prejuízo da ação penal cabível.',
    incidence: 'Alta',
    trapKeywords: ['suspensão', 'perda da função pública', 'indisponibilidade dos bens', 'ressarcimento ao erário', 'sem prejuízo'],
    bancaTrapNote: 'CUIDADO: É SUSPENSÃO dos direitos políticos, NUNCA cassação (a CF/88 veda cassação de direitos políticos no art. 15). A banca adora colocar "perda ou cassação dos direitos políticos".',
    tags: ['Direito Administrativo', 'Improbidade', 'CF/88']
  },
  {
    id: 'vm-lia-1',
    diploma: 'Lei 14.230/21 (LIA)',
    numberStr: 'Art. 1º, §§ 1º e 2º',
    title: 'Exigência Universal de Dolo Específico (Reforma LIA)',
    text: 'Consideram-se atos de improbidade administrativa as condutas tipificadas nos arts. 9º, 10 e 11 desta Lei, ressalvados os tipos previstos em leis especiais. § 1º Considera-se dolo a vontade livre e consciente de alcançar o resultado ilícito tipificado nos arts. 9º, 10 e 11 desta Lei, não bastando a voluntariedade do agente. § 2º Na hipótese de mera negligência, imprudência ou imperícia, não haverá ato de improbidade administrativa.',
    incidence: 'Alta',
    trapKeywords: ['vontade livre e consciente', 'resultado ilícito', 'não bastando a voluntariedade', 'não haverá ato de improbidade'],
    bancaTrapNote: 'Atenção máxima: Culpa grave NÃO configura improbidade após a Lei 14.230/21. O dolo genérico também não basta; é exigido o dolo específico de alcançar o resultado ilícito.',
    relatedQuestionId: 'q-pf-7',
    tags: ['Direito Administrativo', 'Improbidade Administrativa', 'Atualização Legislativa']
  },
  {
    id: 'vm-8112-136',
    diploma: 'Lei 8.112/90',
    numberStr: 'Art. 136 c/c Art. 132',
    title: 'Demissão e Indisponibilidade Patrimonial',
    text: 'A demissão ou a destituição de cargo em comissão, nos casos dos incisos IV, VIII, X e XI do art. 132, implica a indisponibilidade dos bens e o ressarcimento ao erário, sem prejuízo da ação penal cabível.',
    incidence: 'Alta',
    trapKeywords: ['implica a indisponibilidade dos bens', 'ressarcimento ao erário', 'sem prejuízo da ação penal cabível'],
    bancaTrapNote: 'Cai muito em concursos federais (PF, PRF, INSS, Tribunais Federais). A banca tenta dizer que a indisponibilidade de bens depende de decisão do juiz criminal.',
    relatedQuestionId: 'q-pf-6',
    tags: ['Direito Administrativo', 'Lei 8.112/90', 'Regime Disciplinar']
  },
  {
    id: 'vm-14133-74',
    diploma: 'Lei 14.133/21 (Licitações)',
    numberStr: 'Art. 74, inciso III',
    title: 'Inexigibilidade de Licitação para Serviços Técnicos Notórios',
    text: 'É inexigível a licitação quando inviável a competição, em especial nos casos de: III - contratação dos seguintes serviços técnicos especializados de natureza predominantemente intelectual com profissionais ou empresas de notória especialização, vedada a inexigibilidade para serviços de publicidade e divulgação.',
    incidence: 'Alta',
    trapKeywords: ['inexigível', 'inviável a competição', 'notória especialização', 'natureza predominantemente intelectual', 'vedada a inexigibilidade para serviços de publicidade'],
    bancaTrapNote: 'Pegadinha fatal de FGV e Cebraspe: Publicidade e propaganda NUNCA podem ser contratadas por inexigibilidade, mesmo que a agência seja a mais famosa do país!',
    relatedQuestionId: 'q-fgv-3',
    tags: ['Direito Administrativo', 'Licitações', 'Lei 14.133/21']
  },
  {
    id: 'vm-8213-15',
    diploma: 'Lei 8.213/91 (Previdência)',
    numberStr: 'Art. 15',
    title: 'Período de Graça (Manutenção da Qualidade de Segurado)',
    text: 'Mantém a qualidade de segurado, independentemente de contribuições: II - até 12 (doze) meses após a cessação das contribuições, o segurado que deixar de exercer atividade remunerada abrangida pela Previdência Social. § 1º O prazo do inciso II será prorrogado para até 24 (vinte e quatro) meses se o segurado já tiver pago mais de 120 (cento e vinte) contribuições mensais sem interrupção que acarrete a perda da qualidade de segurado. § 2º Os prazos do inciso II ou do § 1º serão acrescidos de 12 (doze) meses para o segurado desempregado, desde que comprovada essa situação pelo registro no órgão próprio.',
    incidence: 'Alta',
    trapKeywords: ['independentemente de contribuições', 'até 12 meses', 'prorrogado para até 24 meses', 'mais de 120 contribuições', 'acrescidos de 12 meses para o segurado desempregado'],
    bancaTrapNote: 'O período de graça do desempregado com mais de 120 contribuições pode chegar a incríveis 36 meses (12 + 12 + 12). A Cebraspe adora fazer contas com essas prorrogações!',
    tags: ['Direito Previdenciário', 'INSS', 'Seguridade Social']
  }
];

export const INITIAL_MICRO_SUMMARIES: MicroSummary[] = [
  {
    id: 'sum-lia-reforma',
    subjectName: 'Direito Administrativo',
    topicName: 'Improbidade Administrativa (Lei 14.230/21)',
    banca: 'Cebraspe / FGV',
    title: 'Raio-X da Nova Lei de Improbidade (O que as bancas cobram)',
    keyPoints: [
      'Extinção da Improbidade Culposa: Somente condutas com DOLO ESPECÍFICO configuram ato ímprobo.',
      'Prazo Prescricional Unificado: 8 anos contados a partir da data do fato (art. 23). Interrupções reiniciam pela metade (4 anos).',
      'Rol do Art. 11 (Princípios) agora é TAXATIVO: Condutas não listadas expressamente não configuram improbidade funcional.',
      'Legitimidade Exclusiva: Apenas o Ministério Público tem legitimidade para a ação de improbidade (pessoa jurídica lesada atua como assistente).'
    ],
    bancaTrapAlert: 'A banca vai tentar te seduzir com "culpa gravíssima equivalente a dolo". NÃO CAIA: culpa grave não é dolo!',
    mnemonic: 'P-I-P-O-C-A: Prescrição em 8 anos; Inexistência de culpa; Princípios com rol taxativo; Órgão exclusivo é o MP.'
  },
  {
    id: 'sum-dir-const-inviolabilidade',
    subjectName: 'Direito Constitucional',
    topicName: 'Inviolabilidade Domiciliar (Art. 5º, XI CF/88)',
    banca: 'Cebraspe / Vunesp',
    title: 'Regras de Ouro da Entrada em Domicílio',
    keyPoints: [
      'De Dia e de Noite: Flagrante delito, desastre natural ou prestar socorro a vítimas.',
      'Apenas Durante o Dia: Determinação judicial (mandado de busca e apreensão).',
      'Conceito Amplo de Casa: Inclui quartos de hotel ocupados, escritórios profissionais e boleias de caminhão (se utilizada como moradia).',
      'Tema 280/STF: Entrada noturna em flagrante delito exige "fundadas razões" objetivas e justificadas a posteriori.'
    ],
    bancaTrapAlert: 'Mandado judicial executado às 22h é NULO e gera responsabilidade por abuso de autoridade.',
    mnemonic: 'F-D-S (Flagrante, Desastre, Socorro) = Qualquer hora. Mandado do Juiz = Só com a luz do Sol.'
  },
  {
    id: 'sum-tributario-decadencia',
    subjectName: 'Direito Tributário',
    topicName: 'Decadência no Lançamento por Homologação',
    banca: 'FGV',
    title: 'Termo Inicial da Decadência Tributária (Tema 163/STJ)',
    keyPoints: [
      'Houve pagamento antecipado (mesmo parcial) e SEM fraude: Prazo de 5 anos conta da DATA DO FATO GERADOR (art. 150, § 4º do CTN).',
      'NÃO houve pagamento antecipado OU com dolo/fraude: Prazo de 5 anos conta do PRIMEIRO DIA DO EXERCÍCIO SEGUINTE àquele em que o lançamento poderia ter sido efetuado (art. 173, I do CTN).',
      'Súmula Vinculante 8 do STF: São inconstitucionais normas estaduais ou municipais que fixem prazo decadencial diferente de 5 anos.'
    ],
    bancaTrapAlert: 'A FGV coloca um caso onde o contribuinte pagou 10% do valor e pergunta quando prescreve. A regra muda do 173 para o 150!',
    mnemonic: 'Pagou nem que seja um tostão? Conta do Fato Gerador! Não pagou nada ou foi pilantra? Conta do 1º de Janeiro do ano seguinte!'
  }
];
