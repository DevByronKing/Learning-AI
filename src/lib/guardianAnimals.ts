import { GuardianAnimal } from './types';

export const GUARDIAN_ANIMALS: GuardianAnimal[] = [
  {
    id: 'coruja',
    name: 'Coruja Atena',
    title: 'A Guardiã da Sabedoria Jurídica',
    emoji: '🦉',
    archetype: 'Mestre Analítico',
    superpower: 'Visão Noturna de Pegadinhas',
    cognitiveStyle: 'Análise minuciosa de lei seca, busca ativa de exceções e memória enciclopédica de jurisprudência.',
    motto: '"Nas entrelinhas da lei reside a chave da posse."',
    colorGradient: 'from-amber-400 via-blue-600 to-slate-900',
    glowColor: 'rgba(37, 99, 235, 0.35)',
    bestForCareers: ['Magistratura', 'Defensoria Pública', 'Analista Judiciário', 'Ministério Público'],
    stats: {
      foco: 98,
      velocidade: 80,
      resiliencia: 92,
      estrategia: 95
    }
  },
  {
    id: 'lobo',
    name: 'Lobo-Guará',
    title: 'O Estrategista Tático',
    emoji: '🐺',
    archetype: 'Operador de Elite',
    superpower: 'Faro para Distratores de Alta Pressão',
    cognitiveStyle: 'Cálculo frio de risco na pontuação líquida Cebraspe, velocidade de tiro curto e sangue frio sob estresse.',
    motto: '"Um passo em falso custa um ponto; o foco absoluto garante a farda."',
    colorGradient: 'from-orange-500 via-amber-600 to-slate-900',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    bestForCareers: ['Polícia Federal (PF)', 'Polícia Rodoviária Federal (PRF)', 'Polícia Civil', 'Perícia Criminal'],
    stats: {
      foco: 90,
      velocidade: 96,
      resiliencia: 98,
      estrategia: 92
    }
  },
  {
    id: 'gaviao',
    name: 'Gavião Real',
    title: 'O Olho Cirúrgico Fiscal',
    emoji: '🦅',
    archetype: 'Auditor Implacável',
    superpower: 'Radar de Inconsistências & Números',
    cognitiveStyle: 'Visão panorâmica de 360º sobre demonstrações contábeis, legislação tributária e minúcias de enunciados longos da FGV.',
    motto: '"Nenhum centavo nem detalhe de edital escapa ao olhar clínico."',
    colorGradient: 'from-emerald-400 via-teal-600 to-cyan-800',
    glowColor: 'rgba(20, 184, 166, 0.35)',
    bestForCareers: ['Receita Federal (AFRFB)', 'SEFAZ (Auditor Fiscal)', 'TCU / TCE', 'ISS'],
    stats: {
      foco: 96,
      velocidade: 84,
      resiliencia: 90,
      estrategia: 97
    }
  },
  {
    id: 'leao',
    name: 'Leão Soberano',
    title: 'O Líder de Carreiras de Estado',
    emoji: '🦁',
    archetype: 'Tribuno Convicto',
    superpower: 'Autoridade e Domínio Argumentativo',
    cognitiveStyle: 'Oratória, estruturação de peças jurídicas de alta pontuação, fundamentação constitucional e postura vencedora.',
    motto: '"A toga e o cargo de liderança pertencem a quem domina a narrativa justa."',
    colorGradient: 'from-yellow-400 via-amber-500 to-red-600',
    glowColor: 'rgba(234, 179, 8, 0.35)',
    bestForCareers: ['Procuradorias (AGU, PGE, PGM)', 'Diplomacia (CACD)', 'Cartórios', 'Tribunais'],
    stats: {
      foco: 92,
      velocidade: 82,
      resiliencia: 94,
      estrategia: 96
    }
  },
  {
    id: 'raposa',
    name: 'Raposa Ágil',
    title: 'A Mestre dos Atalhos Lógicos',
    emoji: '🦊',
    archetype: 'Otimizador de Provas',
    superpower: 'Desmonte Veloz de Proposições',
    cognitiveStyle: 'Identificação imediata da lógica sentencial, eliminação de alternativas por contradição e gestão impecável do tempo de prova.',
    motto: '"Enquanto outros decoram fórmulas, eu enxergo os padrões invisíveis."',
    colorGradient: 'from-rose-500 via-pink-600 to-slate-900',
    glowColor: 'rgba(236, 72, 153, 0.35)',
    bestForCareers: ['Técnico Judiciário', 'Carreiras Bancárias (BB, Caixa)', 'Analista de Gestão', 'Concursos Gerais'],
    stats: {
      foco: 88,
      velocidade: 99,
      resiliencia: 86,
      estrategia: 94
    }
  },
  {
    id: 'onca',
    name: 'Onça Pintada',
    title: 'A Guardiã da Resiliência Soberana',
    emoji: '🐆',
    archetype: 'Guerreiro de Longo Prazo',
    superpower: 'Recuperação Imediata de Erros (Modo Revanche)',
    cognitiveStyle: 'Resistência metabólica e psicológica para ciclos longos de estudo (Ciclo Meirelles), consistência diária e disciplina férrea.',
    motto: '"A constância diária vence o cansaço e devora os concorrentes."',
    colorGradient: 'from-amber-500 via-yellow-600 to-stone-900',
    glowColor: 'rgba(217, 119, 6, 0.35)',
    bestForCareers: ['Editais Abertos (Pós-Edital)', 'Ciclos Intensivos de 6h+', 'Transição de Carreira'],
    stats: {
      foco: 94,
      velocidade: 88,
      resiliencia: 100,
      estrategia: 90
    }
  }
];

export const DEFAULT_STUDENT_PROFILE = {
  name: 'Concurseiro(a)',
  warName: 'Futuro Servidor',
  targetCareer: 'policial' as const,
  targetExamTitle: 'Polícia Federal & Rodoviária Federal',
  dailyHoursGoal: 4.0,
  experienceLevel: 'intermediario' as const,
  guardianAnimalId: 'coruja' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
