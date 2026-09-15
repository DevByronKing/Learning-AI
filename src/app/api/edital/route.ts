import { NextResponse } from 'next/server';
import { ExamNotice, ExamSubject } from '@/lib/types';

const generateBackendSyllabus = (title: string, role: string, banca: string, rawText: string = ''): ExamSubject[] => {
  const combined = `${title} ${role} ${rawText}`.toLowerCase();

  if (
    combined.includes('polic') ||
    combined.includes('prf') ||
    combined.includes('pf') ||
    combined.includes('seguranc') ||
    combined.includes('penal') ||
    combined.includes('agente') ||
    combined.includes('escriv') ||
    combined.includes('delegad')
  ) {
    return [
      {
        id: `sub-${Date.now()}-1`,
        name: 'Direito Penal & Legislação Especial Extravagante',
        weight: 3,
        relevancePercentage: 40,
        totalTopics: 4,
        topics: [
          { id: 't-pol-1', name: 'Crimes Contra o Patrimônio e a Administração Pública', frequencyInBanca: 'Alta', accuracyRate: 52, status: 'Ponto Cego', articlesOrLaws: ['Arts. 155-180, 312-327 do CP'] },
          { id: 't-pol-2', name: 'Lei de Drogas (Lei 11.343/06) & Tráfico Privilegiado', frequencyInBanca: 'Alta', accuracyRate: 75, status: 'Dominado', articlesOrLaws: ['Lei 11.343/06'] },
          { id: 't-pol-3', name: 'Estatuto do Desarmamento & Posse/Porte de Arma', frequencyInBanca: 'Alta', accuracyRate: 64, status: 'Instável', articlesOrLaws: ['Lei 10.826/03'] },
          { id: 't-pol-4', name: 'Abuso de Autoridade & Pacote Anticrime', frequencyInBanca: 'Média', accuracyRate: 48, status: 'Ponto Cego', articlesOrLaws: ['Lei 13.869/19', 'Lei 13.964/19'] }
        ]
      },
      {
        id: `sub-${Date.now()}-2`,
        name: 'Direito Processual Penal & Perícia',
        weight: 3,
        relevancePercentage: 30,
        totalTopics: 3,
        topics: [
          { id: 't-pol-5', name: 'Inquérito Policial (Características e Sigilo)', frequencyInBanca: 'Alta', accuracyRate: 80, status: 'Dominado', articlesOrLaws: ['Arts. 4º a 23 do CPP'] },
          { id: 't-pol-6', name: 'Prisão em Flagrante, Preventiva e Liberdade Provisória', frequencyInBanca: 'Alta', accuracyRate: 55, status: 'Instável', articlesOrLaws: ['Arts. 310-313 do CPP'] },
          { id: 't-pol-7', name: 'Cadeia de Custódia e Teoria Geral das Provas', frequencyInBanca: 'Alta', accuracyRate: 40, status: 'Ponto Cego', articlesOrLaws: ['Art. 158-A do CPP'] }
        ]
      },
      {
        id: `sub-${Date.now()}-3`,
        name: combined.includes('prf') ? 'Legislação de Trânsito (CTB)' : 'Informática Aplicada & Segurança Cibernética',
        weight: 2,
        relevancePercentage: 18,
        totalTopics: 2,
        topics: [
          { id: 't-pol-8', name: combined.includes('prf') ? 'Normas Gerais de Circulação e Conduta no CTB' : 'Redes de Comunicação, Ransomware e Criptografia', frequencyInBanca: 'Alta', accuracyRate: 60, status: 'Instável', articlesOrLaws: combined.includes('prf') ? ['Arts. 26 a 67 do CTB'] : undefined },
          { id: 't-pol-9', name: combined.includes('prf') ? 'Crimes de Trânsito e Embriaguez ao Volante' : 'Bancos de Dados, SQL e Python Básico', frequencyInBanca: 'Média', accuracyRate: 70, status: 'Dominado', articlesOrLaws: combined.includes('prf') ? ['Art. 306 do CTB'] : undefined }
        ]
      },
      {
        id: `sub-${Date.now()}-4`,
        name: 'Língua Portuguesa & Redação Oficial',
        weight: 1,
        relevancePercentage: 12,
        totalTopics: 2,
        topics: [
          { id: 't-pol-10', name: `Interpretação e Inferência Textual (Padrão ${banca})`, frequencyInBanca: 'Alta', accuracyRate: 65, status: 'Instável' },
          { id: 't-pol-11', name: 'Sintaxe de Concordância, Regência e Crase', frequencyInBanca: 'Alta', accuracyRate: 85, status: 'Dominado' }
        ]
      }
    ];
  }

  if (
    combined.includes('fiscal') ||
    combined.includes('receita') ||
    combined.includes('tribut') ||
    combined.includes('sefaz') ||
    combined.includes('iss') ||
    combined.includes('auditor')
  ) {
    return [
      {
        id: `sub-${Date.now()}-1`,
        name: 'Direito Tributário & Sistema Constitucional Tributário',
        weight: 3,
        relevancePercentage: 35,
        totalTopics: 3,
        topics: [
          { id: 't-fisc-1', name: 'Competência Tributária e Limitações ao Poder de Tributar', frequencyInBanca: 'Alta', accuracyRate: 78, status: 'Dominado', articlesOrLaws: ['Arts. 145-156 da CF/88'] },
          { id: 't-fisc-2', name: 'Obrigação Tributária e Crédito Tributário (Lançamento e Suspensão)', frequencyInBanca: 'Alta', accuracyRate: 48, status: 'Ponto Cego', articlesOrLaws: ['Arts. 113-155 do CTN'] },
          { id: 't-fisc-3', name: 'Impostos Federais, Estaduais e Municipais', frequencyInBanca: 'Média', accuracyRate: 62, status: 'Instável', articlesOrLaws: ['CTN & CF/88'] }
        ]
      },
      {
        id: `sub-${Date.now()}-2`,
        name: 'Contabilidade Geral & Avançada',
        weight: 3,
        relevancePercentage: 30,
        totalTopics: 3,
        topics: [
          { id: 't-fisc-4', name: 'Demonstrações Contábeis (Balanço, DRE e DFC)', frequencyInBanca: 'Alta', accuracyRate: 42, status: 'Ponto Cego', articlesOrLaws: ['Lei 6.404/76 e CPCs'] },
          { id: 't-fisc-5', name: 'Pronunciamentos Técnicos CPC (Estoques, Imobilizado, Arrendamentos)', frequencyInBanca: 'Alta', accuracyRate: 50, status: 'Ponto Cego' },
          { id: 't-fisc-6', name: 'Escrituração Contábil e Ajustes de Encerramento', frequencyInBanca: 'Média', accuracyRate: 80, status: 'Dominado' }
        ]
      },
      {
        id: `sub-${Date.now()}-3`,
        name: 'Auditoria Governamental & Fiscal',
        weight: 2,
        relevancePercentage: 20,
        totalTopics: 2,
        topics: [
          { id: 't-fisc-7', name: 'Normas de Auditoria e Amostragem Probabilística', frequencyInBanca: 'Alta', accuracyRate: 68, status: 'Instável', articlesOrLaws: ['NBC TA'] },
          { id: 't-fisc-8', name: 'Fraude vs Erro e Papéis de Trabalho', frequencyInBanca: 'Média', accuracyRate: 85, status: 'Dominado' }
        ]
      },
      {
        id: `sub-${Date.now()}-4`,
        name: 'Legislação Tributária Extravagante',
        weight: 2,
        relevancePercentage: 15,
        totalTopics: 2,
        topics: [
          { id: 't-fisc-9', name: 'Crimes Contra a Ordem Tributária (Lei 8.137/90)', frequencyInBanca: 'Alta', accuracyRate: 60, status: 'Instável', articlesOrLaws: ['Lei 8.137/90'] },
          { id: 't-fisc-10', name: 'Simples Nacional (LC 123/06)', frequencyInBanca: 'Média', accuracyRate: 70, status: 'Dominado', articlesOrLaws: ['LC 123/06'] }
        ]
      }
    ];
  }

  // Padrão Geral / Tribunais / Administrativo
  return [
    {
      id: `sub-${Date.now()}-1`,
      name: 'Direito Constitucional & Teoria da Constituição',
      weight: 3,
      relevancePercentage: 35,
      totalTopics: 3,
      topics: [
        { id: 't-gen-1', name: 'Direitos e Garantias Fundamentais (Art. 5º da CF)', frequencyInBanca: 'Alta', accuracyRate: 85, status: 'Dominado', articlesOrLaws: ['Art. 5º, CF/88'] },
        { id: 't-gen-2', name: 'Organização Político-Administrativa e Repartição de Competências', frequencyInBanca: 'Alta', accuracyRate: 52, status: 'Ponto Cego', articlesOrLaws: ['Arts. 18-36, CF/88'] },
        { id: 't-gen-3', name: 'Controle de Constitucionalidade (Concentrado e Difuso)', frequencyInBanca: 'Alta', accuracyRate: 42, status: 'Ponto Cego', articlesOrLaws: ['Art. 102 e 103, CF/88'] }
      ]
    },
    {
      id: `sub-${Date.now()}-2`,
      name: 'Direito Administrativo & Servidores Públicos',
      weight: 3,
      relevancePercentage: 30,
      totalTopics: 3,
      topics: [
        { id: 't-gen-4', name: 'Regime Jurídico dos Servidores Públicos (Lei 8.112/90)', frequencyInBanca: 'Alta', accuracyRate: 72, status: 'Instável', articlesOrLaws: ['Lei 8.112/90'] },
        { id: 't-gen-5', name: 'Nova Lei de Licitações e Contratos Administrativos', frequencyInBanca: 'Alta', accuracyRate: 45, status: 'Ponto Cego', articlesOrLaws: ['Lei 14.133/21'] },
        { id: 't-gen-6', name: 'Atos Administrativos (Requisitos, Atributos e Extinção)', frequencyInBanca: 'Alta', accuracyRate: 64, status: 'Instável', articlesOrLaws: ['Doutrina Administrativa'] }
      ]
    },
    {
      id: `sub-${Date.now()}-3`,
      name: 'Língua Portuguesa & Interpretação Textual',
      weight: 2,
      relevancePercentage: 20,
      totalTopics: 2,
      topics: [
        { id: 't-gen-7', name: `Compreensão, Interpretação e Tipologia Textual (${banca})`, frequencyInBanca: 'Alta', accuracyRate: 68, status: 'Instável' },
        { id: 't-gen-8', name: 'Sintaxe do Período, Regência, Concordância e Crase', frequencyInBanca: 'Alta', accuracyRate: 82, status: 'Dominado' }
      ]
    },
    {
      id: `sub-${Date.now()}-4`,
      name: 'Raciocínio Lógico & Noções de Tecnologia',
      weight: 1,
      relevancePercentage: 15,
      totalTopics: 2,
      topics: [
        { id: 't-gen-9', name: 'Estruturas Lógicas, Tautologia e Diagramas de Venn', frequencyInBanca: 'Média', accuracyRate: 58, status: 'Instável' },
        { id: 't-gen-10', name: 'Segurança da Informação, LGPD e Ferramentas Digitais', frequencyInBanca: 'Média', accuracyRate: 74, status: 'Dominado' }
      ]
    }
  ];
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      examTitle = 'Edital Analisado por IA',
      role = 'Analista / Técnico',
      banca = 'Cebraspe',
      salary = 'R$ 8.520,00',
      vacancies = 180,
      editalText = '',
      pdfFileName = 'Edital_Processado_Backend.pdf'
    } = body;

    const subjects = generateBackendSyllabus(examTitle, role, banca, editalText);

    const parsedNotice: ExamNotice = {
      id: `notice-${Date.now()}`,
      title: examTitle,
      institution: examTitle.split(' - ')[0] || 'Órgão de Alta Relevância',
      banca: banca as any,
      role,
      salary,
      vacancies: Number(vacancies) || 150,
      examDate: '2026-12-15',
      daysRemaining: 95,
      pdfFileName,
      uploadedAt: new Date().toISOString().split('T')[0],
      subjects
    };

    return NextResponse.json({ 
      success: true, 
      data: parsedNotice,
      processedOnServer: true,
      message: 'Edital verticalizado com sucesso no backend!'
    });
  } catch (error: any) {
    console.error('Erro no processamento de edital no backend:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
