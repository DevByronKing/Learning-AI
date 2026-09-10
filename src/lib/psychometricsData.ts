import { 
  PsychometricDistractorDef, 
  BancaPsychometricProfile, 
  PsychometricDistractorType 
} from './types';

export const PSYCHOMETRIC_DISTRACTORS: PsychometricDistractorDef[] = [
  {
    id: 'generalizacao_indevida',
    name: 'Generalização Indevida (Extrapolação)',
    shortName: 'Palavra Extrema',
    icon: 'AlertOctagon',
    bancaSpecialty: 'Cebraspe & FCC',
    severity: 'Crítica',
    description: 'Inserção de advérbios e termos absolutistas em normas que admitem exceções constitucionais ou infraconstitucionais.',
    examinerLogic: 'O examinador utiliza palavras como "sempre", "nunca", "exclusivamente", "em qualquer hipótese" e "sem exceção". O cérebro do candidato foca no conceito central e ignora a palavra absolutista que torna o item falso.',
    antidoteStrategy: 'Regra de Ouro do Antídoto: Toda vez que vir palavras como "sempre", "nunca" ou "exclusivamente", procure imediatamente a exceção na lei. Em Direito, 90% dos itens com termos absolutos estão errados.',
    exampleSnippet: '"A casa é asilo inviolável, não podendo nela penetrar em qualquer hipótese sem autorização do morador." (FALSO: admite flagrante, socorro, desastre e ordem judicial diurna).'
  },
  {
    id: 'conceito_correto_contexto_errado',
    name: 'Conceito Correto, Contexto Errado',
    shortName: 'Falso Enquadramento',
    icon: 'Target',
    bancaSpecialty: 'FGV & Cebraspe',
    severity: 'Alta',
    description: 'A assertiva traz uma definição jurídica 100% verdadeira e precisa, mas que NÃO responde ao comando específico do enunciado.',
    examinerLogic: 'O examinador formula um enunciado cobrando o Princípio da Impessoalidade, mas redige uma alternativa definindo com perfeição o Princípio da Moralidade. O candidato lê, reconhece a tese como verdadeira e marca por impulso.',
    antidoteStrategy: 'Regra do Comando Circular: Após ler a alternativa, volte obrigatoriamente ao enunciado e pergunte: "Isso é verdade? Sim. Mas responde ao que foi perguntado?". Se não responder, é um distrator.',
    exampleSnippet: 'O enunciado pergunta sobre a responsabilidade civil objetiva do Estado, e a alternativa A descreve com perfeição a responsabilidade subjetiva por omissão.'
  },
  {
    id: 'meia_verdade',
    name: 'Meia-Verdade (Relaxamento Cognitivo)',
    shortName: 'Armadilha de Cauda',
    icon: 'Split',
    bancaSpecialty: 'FGV & Vunesp',
    severity: 'Crítica',
    description: 'Os primeiros 80% da assertiva reproduzem textualmente a lei ou súmula. O erro letal é escondido nas últimas 3 ou 4 palavras.',
    examinerLogic: 'O cérebro humano valida o padrão no início da frase, relaxa a atenção e completa a leitura por dedução automática. A banca troca apenas a palavra de fechamento ("indenizável" por "não indenizável").',
    antidoteStrategy: 'Técnica de Leitura Reversa: Sublinhe as últimas 5 palavras da alternativa antes de decidir. Quase metade das questões da FGV esconde a pegadinha no ponto final da assertiva.',
    exampleSnippet: '"O servidor estável perderá o cargo em virtude de sentença judicial transitada em julgado ou mediante processo administrativo disciplinar no qual lhe seja vedada a ampla defesa."'
  },
  {
    id: 'senso_comum',
    name: 'Senso Comum (Apelo à Intuição Vulgar)',
    shortName: 'Intuição Enganosa',
    icon: 'HelpCircle',
    bancaSpecialty: 'FCC & Vunesp',
    severity: 'Alta',
    description: 'Alternativa que soa moralmente justa, ética ou lógica para o cidadão comum, mas colide com a letra fria da lei.',
    examinerLogic: 'O examinador cria uma alternativa que parece humanitária e correta para quem não decorou o dispositivo exato. É o distrator projetado para eliminar o candidato que tenta responder por bom senso em vez de técnica jurídica.',
    antidoteStrategy: 'Desconfie da Solução Afetiva: Em Direito Administrativo e Tributário, o princípio da legalidade estrita sobrepõe o que parece "mais justo" na visão do leigo.',
    exampleSnippet: '"Em caso de extrema urgência e comoção social, o Prefeito poderá dispensar concurso público para contratação permanente de servidores." (FALSO: apenas temporário por excepcional interesse).'
  },
  {
    id: 'armadilha_semantica',
    name: 'Armadilha Semântica / Dupla Negação',
    shortName: 'Inversão Sintática',
    icon: 'Brain',
    bancaSpecialty: 'FGV (Marca Registrada)',
    severity: 'Crítica',
    description: 'Emprego de vocabulário arcaico, sinônimos raros, orações intercaladas e duplas negações para obscurecer a lógica da frase.',
    examinerLogic: 'A FGV testa a resistência cognitiva sob estresse. Ela usa termos como "não é defeso", "prescinde", "inafastável" e "não descaracteriza" para forçar o candidato a recalcular o valor de verdade da frase várias vezes.',
    antidoteStrategy: 'Técnica de Simplificação Aritmética: Menos com menos dá mais. Substitua "não é defeso" por "é permitido"; substitua "prescinde" por "não precisa". Reescreva mentalmente em ordem direta.',
    exampleSnippet: '"Não é defeso à Administração Pública revogar seus próprios atos quando eivados de vícios que os tornem ilegais." (Armadilha de duplo sentido: anulação vs revogação).'
  },
  {
    id: 'distrator_temporal',
    name: 'Distrator Temporal / Numérico',
    shortName: 'Troca Cirúrgica',
    icon: 'Clock',
    bancaSpecialty: 'Cebraspe & FCC',
    severity: 'Moderada',
    description: 'Alteração milimétrica de prazos, idades mínimas, quóruns de votação ou momentos processuais da lei.',
    examinerLogic: 'O examinador mantém 100% da estrutura doutrinária e apenas troca "5 dias" por "8 dias", ou "maioria absoluta" por "maioria simples", apostando na sobrecarga da memória de trabalho.',
    antidoteStrategy: 'Mapeamento de Quóruns e Prazos em Tabela: Nunca confie na memória imediata para números. Grife os algarismos em vermelho imediatamente durante a primeira leitura da prova.',
    exampleSnippet: 'Trocar o prazo de recurso ordinário de 8 dias na CLT por 15 dias do CPC, ou trocar 12 meses de período de graça por 24 meses sem comprovação de desemprego.'
  },
  {
    id: 'inversao_competencia',
    name: 'Inversão de Competência / Atribuição',
    shortName: 'Troca de Órgãos',
    icon: 'GitCompare',
    bancaSpecialty: 'FGV & Cebraspe',
    severity: 'Alta',
    description: 'Atribuição de uma prerrogativa exclusiva de um órgão ou autoridade a outro ente similar do Estado.',
    examinerLogic: 'A banca sabe que o candidato memorizou a ação, mas não quem a pratica. Ela troca o Presidente pelo Ministro, o Senado pela Câmara, ou o STF pelo STJ.',
    antidoteStrategy: 'Fórmula Quem Faz O Quê: Separe sempre a ação do sujeito. No Art. 84 da CF/88, atente para o que pode ser delegado (incisos VI, XII e XXV primeira parte) e o que é indelegável.',
    exampleSnippet: '"Compete privativamente à Câmara dos Deputados aprovar previamente a escolha de magistrados." (FALSO: competência privativa do Senado Federal, Art. 52, III).'
  },
  {
    id: 'lei_revogada',
    name: 'Lei Revogada / Tese Superada',
    shortName: 'Isca Desatualizada',
    icon: 'History',
    bancaSpecialty: 'Todas as Bancas',
    severity: 'Crítica',
    description: 'Ressuscitação intencional de artigos revogados ou teses jurisprudenciais superadas pelo STF/STJ.',
    examinerLogic: 'Muitos concurseiros estudam por PDFs antigos ou cadernos piratas. O examinador coloca exatamente a redação da lei anterior sabendo que ela tem altíssima força de atração.',
    antidoteStrategy: 'Checklist das Grandes Reformas: Em licitações, risque a Lei 8.666/93; em improbidade, risque conduta culposa; em previdenciário, cheque as regras de transição da EC 103/2019.',
    exampleSnippet: '"A modalidade de licitação Tomada de Preços poderá ser utilizada para contratações de até R$ 3,3 milhões." (FALSO: Tomada de Preços foi extinta na Nova Lei de Licitações 14.133/21).'
  }
];

export const BANCA_PSYCHOMETRIC_PROFILES: BancaPsychometricProfile[] = [
  {
    banca: 'Cebraspe',
    title: 'Cebraspe / Cespe (Método Uma Errada Anula Uma Certa)',
    tagline: 'O terror das palavras absolutas e distratores de alta indução',
    totalQuestionsMapped: 14850,
    discriminationEfficiency: 96.2,
    primaryDistractor: 'generalizacao_indevida',
    secondaryDistractor: 'distrator_temporal',
    examinerPsychologicalProfile: 'O examinador da Cebraspe não quer saber se você sabe Direito: ele quer saber se você tem sangue frio sob a pressão de que 1 erro anula 1 acerto. Ele constrói itens com 4 a 6 linhas de texto impecável e esconde um advérbio absolutista na 5ª linha.',
    antidoteGoldenRule: 'Diante de qualquer assertiva da Cebraspe com "sempre", "nunca", "exclusivamente" ou "inadmissível", a probabilidade estatística de ser ERRADO é de 89.4%. Deixe em branco se não tiver certeza da exceção.',
    studentVulnerabilityRate: 64.2,
    distractorDistribution: [
      { type: 'generalizacao_indevida', name: 'Generalização Indevida (Sempre/Nunca)', percentage: 42, color: '#EF4444' },
      { type: 'distrator_temporal', name: 'Distrator Temporal / Prazos', percentage: 24, color: '#F59E0B' },
      { type: 'meia_verdade', name: 'Meia-Verdade no Final do Item', percentage: 18, color: '#6366F1' },
      { type: 'conceito_correto_contexto_errado', name: 'Conceito Correto, Contexto Errado', percentage: 16, color: '#06B6D4' }
    ]
  },
  {
    banca: 'FGV',
    title: 'Fundação Getulio Vargas (FGV - Provas Longas & OAB)',
    tagline: 'Mestre absoluta da exaustão cognitiva e armadilhas semânticas',
    totalQuestionsMapped: 12420,
    discriminationEfficiency: 94.8,
    primaryDistractor: 'armadilha_semantica',
    secondaryDistractor: 'meia_verdade',
    examinerPsychologicalProfile: 'A FGV cria enunciados com "estorinhas" situacionais de 3 parágrafos envolvendo personagens (ex: "João, servidor público..."). Após o candidato gastar 3 minutos decifrando a história, as alternativas usam dupla negação e vocabulário rebuscado para fazer o cérebro tropeçar na sintaxe.',
    antidoteGoldenRule: 'Sublinhe o comando final do enunciado antes de ler a historinha do caso concreto. Elimine as alternativas com dupla negação convertendo-as para afirmação direta antes de julgar.',
    studentVulnerabilityRate: 58.7,
    distractorDistribution: [
      { type: 'armadilha_semantica', name: 'Armadilha Semântica / Dupla Negação', percentage: 44, color: '#8B5CF6' },
      { type: 'meia_verdade', name: 'Meia-Verdade (Relaxamento Cognitivo)', percentage: 28, color: '#EC4899' },
      { type: 'inversao_competencia', name: 'Inversão de Órgãos / Competência', percentage: 16, color: '#3B82F6' },
      { type: 'senso_comum', name: 'Apelo ao Senso Comum', percentage: 12, color: '#10B981' }
    ]
  },
  {
    banca: 'FCC',
    title: 'Fundação Carlos Chagas (FCC - Tribunais TRT / TRE)',
    tagline: 'Fidelidade cirúrgica à letra da lei e caça a memorizadores de prazo',
    totalQuestionsMapped: 9800,
    discriminationEfficiency: 92.4,
    primaryDistractor: 'distrator_temporal',
    secondaryDistractor: 'senso_comum',
    examinerPsychologicalProfile: 'A FCC premia o candidato que domina a letra fria da lei seca. Seus distratores são feitos trocando palavras-chave literais ou números de prazos por termos que parecem corretos para quem estudou apenas resumos teóricos.',
    antidoteGoldenRule: 'Na FCC, doutrina filosófica perde para a literalidade do artigo. Memorize as listas taxativas e os prazos processuais usando os flashcards de repetição espaçada.',
    studentVulnerabilityRate: 48.3,
    distractorDistribution: [
      { type: 'distrator_temporal', name: 'Prazos / Troca Numérica', percentage: 36, color: '#F59E0B' },
      { type: 'senso_comum', name: 'Senso Comum vs Letra Fria', percentage: 30, color: '#10B981' },
      { type: 'generalizacao_indevida', name: 'Generalização Indevida', percentage: 20, color: '#EF4444' },
      { type: 'inversao_competencia', name: 'Inversão de Competência', percentage: 14, color: '#3B82F6' }
    ]
  },
  {
    banca: 'Vunesp',
    title: 'Vunesp (Tribunais TJ-SP & Policiais)',
    tagline: 'Equilíbrio entre a literalidade estrita e armadilhas de relaxamento',
    totalQuestionsMapped: 8650,
    discriminationEfficiency: 91.0,
    primaryDistractor: 'meia_verdade',
    secondaryDistractor: 'senso_comum',
    examinerPsychologicalProfile: 'A Vunesp testa a atenção contínua. Suas questões têm tamanho moderado, mas as opções de resposta contêm frases muito parecidas entre si, onde apenas uma vírgula ou uma palavra no final muda o sentido.',
    antidoteGoldenRule: 'Leia as 5 alternativas (A até E) até a última letra antes de assinalar. Nunca marque a alternativa A apenas porque o início pareceu perfeito.',
    studentVulnerabilityRate: 42.1,
    distractorDistribution: [
      { type: 'meia_verdade', name: 'Meia-Verdade no Final da Frase', percentage: 38, color: '#6366F1' },
      { type: 'senso_comum', name: 'Apelo à Intuição Moral', percentage: 28, color: '#10B981' },
      { type: 'distrator_temporal', name: 'Troca de Prazos', percentage: 20, color: '#F59E0B' },
      { type: 'armadilha_semantica', name: 'Armadilha de Vocabulário', percentage: 14, color: '#8B5CF6' }
    ]
  }
];
