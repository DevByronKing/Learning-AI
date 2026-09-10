export interface Mascot {
  id: 'coruja' | 'falcao' | 'lobo' | 'leao';
  name: string;
  species: string;
  emoji: string;
  title: string;
  advice: string;
  specialty: string;
  bgGradient: [string, string];
}

export const MASCOTS: Mascot[] = [
  {
    id: 'coruja',
    name: 'Atena',
    species: 'Coruja Estrategista',
    emoji: '🦉',
    title: 'Guardiã da Sabedoria & Foco Noturno',
    advice: 'Não tente devorar todo o edital de uma vez só. O segredo da aprovação está em dominar com precisão cirúrgica os 20% que representam 80% da prova.',
    specialty: 'Pegadinhas Cebraspe & FGV',
    bgGradient: ['#312E81', '#1E1B4B'],
  },
  {
    id: 'falcao',
    name: 'Áquila',
    species: 'Falcão Sniper',
    emoji: '🦅',
    title: 'Mira Veloz em Matérias de Peso 3',
    advice: 'Tempo de prova é eliminatório. Quando você bate o olho em uma questão de Direito Administrativo, o comando da questão já deve te entregar a pegadinha.',
    specialty: 'Velocidade & Decisão sob Pressão',
    bgGradient: ['#065F46', '#064E3B'],
  },
  {
    id: 'lobo',
    name: 'Fenrir',
    species: 'Lobo da Constância',
    emoji: '🐺',
    title: 'Resiliência Diária & Baralho SRS',
    advice: 'O estudo espaçado vence qualquer genialidade. 15 flashcards revisados hoje evitam que você esqueça daqui a 15 dias na hora da prova.',
    specialty: 'Repetição Espaçada & Hábitos',
    bgGradient: ['#1E3A8A', '#172554'],
  },
  {
    id: 'leao',
    name: 'Apolo',
    species: 'Leão da Posse',
    emoji: '🦁',
    title: 'Mestre da Redação & Discursivas',
    advice: 'Quem passa nas primeiras colocações domina a fundamentação jurídica. Não cite apenas a lei: conecte com o princípio constitucional aplicável.',
    specialty: 'Peças Práticas & Argumentação',
    bgGradient: ['#78350F', '#451A03'],
  },
];

export interface MobileOption {
  id: string;
  text: string;
  isCorrect: boolean;
  distractorType?: string;
  distractorExplanation?: string;
}

export interface MobileQuestion {
  id: string;
  banca: 'Cebraspe' | 'FGV' | 'FCC';
  year: number;
  subject: string;
  topic: string;
  statement: string;
  format: 'certo_errado' | 'multipla_escolha';
  options: MobileOption[];
  explanation: string;
  lawArticle: string;
  trapAlert: string;
}

export interface MobilePsychometricDistractor {
  id: string;
  name: string;
  frequencyCebraspe: number;
  frequencyFGV: number;
  frequencyFCC: number;
  userVulnerability: number; // percentage
  status: 'crítico' | 'alerta' | 'seguro';
  antidote: string;
}

export const MOCK_MOBILE_DISTRACTORS: MobilePsychometricDistractor[] = [
  {
    id: 'generalizacao_indevida',
    name: 'Generalização Indevida',
    frequencyCebraspe: 42,
    frequencyFGV: 24,
    frequencyFCC: 18,
    userVulnerability: 68,
    status: 'crítico',
    antidote: 'Desconfie de "sempre", "nunca", "em qualquer hipótese". Busque a exceção da regra geral.',
  },
  {
    id: 'armadilha_semantica',
    name: 'Armadilha Semântica',
    frequencyCebraspe: 22,
    frequencyFGV: 44,
    frequencyFCC: 15,
    userVulnerability: 74,
    status: 'crítico',
    antidote: 'Isole os termos técnicos dos qualificadores coloquiais em casos hipotéticos longos.',
  },
  {
    id: 'distrator_temporal',
    name: 'Distrator Temporal / Prazos',
    frequencyCebraspe: 18,
    frequencyFGV: 16,
    frequencyFCC: 36,
    userVulnerability: 52,
    status: 'alerta',
    antidote: 'Crie tabelas de prazos e marcos iniciais (dia vs noite, publicação vs trânsito em julgado).',
  },
  {
    id: 'meia_verdade',
    name: 'Meia-Verdade Estrutural',
    frequencyCebraspe: 28,
    frequencyFGV: 30,
    frequencyFCC: 22,
    userVulnerability: 41,
    status: 'alerta',
    antidote: 'Divida a oração em blocos lógicos. A primeira metade correta não valida a segunda.',
  },
  {
    id: 'conceito_correto_contexto_errado',
    name: 'Conceito Correto, Contexto Errado',
    frequencyCebraspe: 19,
    frequencyFGV: 26,
    frequencyFCC: 28,
    userVulnerability: 35,
    status: 'seguro',
    antidote: 'Cheque se o instituto invocado responde diretamente à pergunta do comando.',
  },
  {
    id: 'inversao_competencia',
    name: 'Inversão de Competência',
    frequencyCebraspe: 15,
    frequencyFGV: 20,
    frequencyFCC: 31,
    userVulnerability: 29,
    status: 'seguro',
    antidote: 'Mapeie quem executa vs quem julga vs quem legisla (ex: TCU julga contas, não as pessoas).',
  },
];

export const MOCK_QUESTIONS: MobileQuestion[] = [
  {
    id: 'q-1',
    banca: 'Cebraspe',
    year: 2026,
    subject: 'Direito Previdenciário',
    topic: 'Segurados Obrigatórios',
    statement: 'Acerca da seguridade social e dos segurados da previdência social, julgue o item seguinte:\n\nO servidor público ocupante, exclusivamente, de cargo em comissão declarado em lei de livre nomeação e exoneração é segurado obrigatório da previdência social na categoria de empregado.',
    format: 'certo_errado',
    options: [
      { id: 'opt-c', text: 'CERTO', isCorrect: true },
      { 
        id: 'opt-e', 
        text: 'ERRADO', 
        isCorrect: false,
        distractorType: 'senso_comum',
        distractorExplanation: 'Examinador Cebraspe explorou a intuição errônea de que servidor comissionado possuiria regime próprio ou seria autônomo. Ele é expressamente empregado do RGPS.'
      },
    ],
    explanation: 'Correto. Conforme o Art. 12, I, "g" da Lei 8.212/91 e o Art. 40, § 13 da CF/88, o servidor exclusivamente comissionado vincula-se obrigatoriamente ao Regime Geral de Previdência Social (RGPS) na qualidade de empregado.',
    lawArticle: 'Art. 40, § 13 da CF/88 e Art. 12, I, "g" da Lei 8.212/91',
    trapAlert: 'A banca costuma tentar confundir afirmando que o comissionado é contribuinte individual ou que possui regime próprio (RPPS). Ele é EMPREGADO do RGPS.',
  },
  {
    id: 'q-2',
    banca: 'Cebraspe',
    year: 2026,
    subject: 'Direito Constitucional',
    topic: 'Direitos Fundamentais',
    statement: 'A casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador, salvo em caso de flagrante delito ou desastre, ou para prestar socorro, ou, durante a noite, por determinação judicial.',
    format: 'certo_errado',
    options: [
      { 
        id: 'opt-c', 
        text: 'CERTO', 
        isCorrect: false,
        distractorType: 'distrator_temporal',
        distractorExplanation: 'Distrator Temporal da Cebraspe: o examinador trocou cirurgicamente "durante o dia" por "durante a noite" para pegar candidatos em leitura veloz.'
      },
      { id: 'opt-e', text: 'ERRADO', isCorrect: true },
    ],
    explanation: 'Errado! Por determinação judicial, a entrada só pode ocorrer DURANTE O DIA. A banca trocou "durante o dia" por "durante a noite", que é a pegadinha mais clássica da história dos concursos.',
    lawArticle: 'Art. 5º, XI, da CF/88',
    trapAlert: 'Pegadinha temporal: "determinação judicial" SEMPRE exige que seja "durante o dia". À noite, somente com socorro, flagrante ou desastre.',
  },
  {
    id: 'q-3',
    banca: 'FGV',
    year: 2026,
    subject: 'Direito Administrativo',
    topic: 'Poderes e Atos',
    statement: 'A respeito dos atributos dos atos administrativos, assinale a opção que indica o atributo que consiste na presunção de que os atos foram editados em conformidade com a lei:',
    format: 'multipla_escolha',
    options: [
      { 
        id: 'a', 
        text: 'Imperatividade', 
        isCorrect: false,
        distractorType: 'conceito_correto_contexto_errado',
        distractorExplanation: 'Imperatividade é um atributo verídico do ato, mas refere-se à imposição de obrigações a terceiros, não à presunção de validade jurídica.'
      },
      { 
        id: 'b', 
        text: 'Autoexecutoriedade', 
        isCorrect: false,
        distractorType: 'conceito_correto_contexto_errado',
        distractorExplanation: 'Autoexecutoriedade trata da possibilidade de execução direta sem mandado judicial, não de presunção legal.'
      },
      { id: 'c', text: 'Presunção de Legitimidade e Veracidade', isCorrect: true },
      { 
        id: 'd', 
        text: 'Tipicidade', 
        isCorrect: false,
        distractorType: 'conceito_correto_contexto_errado',
        distractorExplanation: 'Tipicidade decorre da legalidade estrita, mas não é a presunção de conformidade normativa.'
      },
      { 
        id: 'e', 
        text: 'Exigibilidade', 
        isCorrect: false,
        distractorType: 'armadilha_semantica',
        distractorExplanation: 'Exigibilidade é meio indireto de coação e atributo subsidiário, utilizado pela FGV para confundir candidatos desatentos.'
      },
    ],
    explanation: 'A presunção de legitimidade diz respeito à conformidade do ato com a lei, enquanto a veracidade refere-se aos fatos alegados pela Administração Pública.',
    lawArticle: 'Doutrina Majoritária de Direito Administrativo (Hely Lopes Meirelles / Maria Sylvia Di Pietro)',
    trapAlert: 'Lembre-se do mnemônico PATI (Presunção, Autoexecutoriedade, Tipicidade, Imperatividade). A presunção é juris tantum (relativa).',
  },
];

export interface MobileFlashcard {
  id: string;
  subject: string;
  topic: string;
  front: string;
  back: string;
  ruleCitation: string;
  easeFactor: number;
}

export const MOCK_FLASHCARDS: MobileFlashcard[] = [
  {
    id: 'fc-1',
    subject: 'Direito Constitucional',
    topic: 'Remédios Constitucionais',
    front: 'Qual é o remédio constitucional cabível para assegurar o conhecimento de informações relativas à pessoa do impetrante?',
    back: 'Habeas Data (Art. 5º, LXXII, "a", CF/88).\n\nRequisito: Exige prévia recusa da autoridade administrativa (Súmula 2 do STJ).',
    ruleCitation: 'Art. 5º, LXXII, CF/88',
    easeFactor: 2.5,
  },
  {
    id: 'fc-2',
    subject: 'Direito Previdenciário',
    topic: 'Período de Graça',
    front: 'Quanto tempo dura o período de graça para o segurado que deixa de exercer atividade remunerada, em regra?',
    back: '12 meses após a cessação das contribuições (Art. 15, II, Lei 8.213/91).\n\nPode ser prorrogado por mais 12 meses se tiver mais de 120 contribuições sem perda da qualidade.',
    ruleCitation: 'Art. 15, Lei 8.213/91',
    easeFactor: 2.2,
  },
  {
    id: 'fc-3',
    subject: 'Direito Administrativo',
    topic: 'Improbidade Administrativa',
    front: 'A conduta culposa ainda caracteriza ato de improbidade administrativa após a Lei 14.230/21?',
    back: 'NÃO! O dolo é elemento subjetivo ESSENCIAL para a configuração de qualquer ato de improbidade administrativa.',
    ruleCitation: 'Art. 1º, § 1º da Lei 8.429/92 alterada pela Lei 14.230/21',
    easeFactor: 2.8,
  },
  {
    id: 'fc-4',
    subject: 'Língua Portuguesa',
    topic: 'Crase & Regência',
    front: 'Ocorre crase antes de pronomes de tratamento em regra?',
    back: 'NÃO ocorre crase antes da maioria dos pronomes de tratamento.\n\nExceções: Senhora, Senhorita e Dona admitem crase.',
    ruleCitation: 'Gramática Normativa Cebraspe / FGV',
    easeFactor: 2.1,
  },
];

export interface MobileAchievement {
  id: string;
  title: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  icon: string;
  progress: number;
  current: number;
  target: number;
  unit: string;
  unlocked: boolean;
  unlockedAt?: string;
  xp: number;
}

export const MOCK_ACHIEVEMENTS: MobileAchievement[] = [
  {
    id: 'ach-1',
    title: 'Primeiro Passo Rumo à Vaga',
    description: 'Resolva seus primeiros 5 simulados no aplicativo.',
    tier: 'bronze',
    icon: 'flag',
    progress: 100,
    current: 5,
    target: 5,
    unit: 'simulados',
    unlocked: true,
    unlockedAt: '02/09/2026',
    xp: 150,
  },
  {
    id: 'ach-2',
    title: 'Sniper da Cebraspe',
    description: 'Acerte 50 questões de Certo ou Errado sem penalidade.',
    tier: 'silver',
    icon: 'locate',
    progress: 76,
    current: 38,
    target: 50,
    unit: 'questões',
    unlocked: false,
    xp: 350,
  },
  {
    id: 'ach-3',
    title: 'Guardião dos 80/20',
    description: 'Atinja 80% de precisão nos tópicos mais frequentes do edital.',
    tier: 'gold',
    icon: 'star',
    progress: 85,
    current: 68,
    target: 80,
    unit: '% acerto',
    unlocked: false,
    xp: 600,
  },
  {
    id: 'ach-4',
    title: 'Mestre da Repetição Espaçada',
    description: 'Revise mais de 100 flashcards pelo algoritmo inteligente.',
    tier: 'silver',
    icon: 'refresh',
    progress: 100,
    current: 120,
    target: 100,
    unit: 'cards',
    unlocked: true,
    unlockedAt: '08/09/2026',
    xp: 400,
  },
  {
    id: 'ach-5',
    title: 'Imunidade a Pegadinhas',
    description: 'Identifique 30 pegadinhas clássicas sinalizadas pela IA.',
    tier: 'gold',
    icon: 'shield-checkmark',
    progress: 60,
    current: 18,
    target: 30,
    unit: 'pegadinhas',
    unlocked: false,
    xp: 500,
  },
  {
    id: 'ach-6',
    title: 'Nome no Diário Oficial',
    description: 'Supere a nota de corte projetada em 3 simulados oficiais seguidos.',
    tier: 'diamond',
    icon: 'trophy',
    progress: 33,
    current: 1,
    target: 3,
    unit: 'simulados',
    unlocked: false,
    xp: 1200,
  },
];
