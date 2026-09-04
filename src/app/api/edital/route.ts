import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { editalText, examTitle } = body;

    // Structure a realistic AI-extracted edital response
    const parsedEdital = {
      title: examTitle || 'Edital Analisado por IA',
      institution: 'Órgão de Alta Relevância',
      banca: 'Cebraspe',
      role: 'Técnico / Analista',
      salary: 'R$ 7.850,00',
      vacancies: 300,
      examDate: '2026-11-20',
      daysRemaining: 80,
      subjects: [
        {
          id: `sub-${Date.now()}-1`,
          name: 'Conhecimentos Específicos & Legislação',
          weight: 3,
          relevancePercentage: 55,
          totalTopics: 5,
          topics: [
            { id: 't-1', name: 'Regime Jurídico dos Servidores Públicos', frequencyInBanca: 'Alta', accuracyRate: 60, status: 'Instável', articlesOrLaws: ['Lei 8.112/90'] },
            { id: 't-2', name: 'Atos Administrativos & Discricionariedade', frequencyInBanca: 'Alta', accuracyRate: 40, status: 'Ponto Cego', articlesOrLaws: ['Doutrina Administrativa'] },
            { id: 't-3', name: 'Processo Administrativo Federal', frequencyInBanca: 'Média', accuracyRate: 85, status: 'Dominado', articlesOrLaws: ['Lei 9.784/99'] }
          ]
        },
        {
          id: `sub-${Date.now()}-2`,
          name: 'Língua Portuguesa & Interpretação',
          weight: 2,
          relevancePercentage: 25,
          totalTopics: 4,
          topics: [
            { id: 't-4', name: 'Reescritura de Frases e Sintaxe Cebraspe', frequencyInBanca: 'Alta', accuracyRate: 45, status: 'Ponto Cego' },
            { id: 't-5', name: 'Crase e Regência Verbal', frequencyInBanca: 'Alta', accuracyRate: 75, status: 'Dominado' }
          ]
        },
        {
          id: `sub-${Date.now()}-3`,
          name: 'Direito Constitucional',
          weight: 2,
          relevancePercentage: 20,
          totalTopics: 3,
          topics: [
            { id: 't-6', name: 'Direitos Fundamentais (Art. 5º da CF)', frequencyInBanca: 'Alta', accuracyRate: 90, status: 'Dominado', articlesOrLaws: ['Art. 5º, CF/88'] },
            { id: 't-7', name: 'Administração Pública na CF (Art. 37 ao 41)', frequencyInBanca: 'Alta', accuracyRate: 55, status: 'Instável', articlesOrLaws: ['Art. 37 a 41, CF/88'] }
          ]
        }
      ]
    };

    return NextResponse.json({ success: true, data: parsedEdital });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
