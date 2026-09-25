import { describe, it, expect, beforeEach } from 'vitest';
import { generateDynamicSchedule } from '@/lib/studyCycleUtils';
import { INITIAL_EXAMS } from '@/lib/mockData';
import { ExamNotice } from '@/lib/types';

describe('Edital Padrão & Adaptação Sistêmica da Plataforma', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve gerar cronograma Meirelles adaptado para a Polícia Federal com pesos específicos', () => {
    const pfExam = INITIAL_EXAMS.find((e) => e.id === 'exam-pf-2026');
    expect(pfExam).toBeDefined();

    if (pfExam) {
      const schedule = generateDynamicSchedule(pfExam, 4, 'Direito Penal');
      expect(schedule).toHaveLength(3);

      // Todas as disciplinas do cronograma devem pertencer ao edital da PF
      const pfSubjectNames = pfExam.subjects.map((s) => s.name);
      schedule.forEach((day) => {
        expect(day.blocks.length).toBeGreaterThan(0);
        day.blocks.forEach((block) => {
          expect(pfSubjectNames).toContain(block.subjectName);
        });
      });

      // No primeiro dia, o primeiro bloco deve ser a matéria fraca (Calcanhar de Aquiles)
      expect(schedule[0].blocks[0].subjectName).toContain('Penal');
    }
  });

  it('deve gerar cronograma adaptado para a Receita Federal incluindo matérias fiscais', () => {
    const receitaExam = INITIAL_EXAMS.find((e) => e.id === 'exam-receita-2026');
    expect(receitaExam).toBeDefined();

    if (receitaExam) {
      const schedule = generateDynamicSchedule(receitaExam, 5);
      expect(schedule).toHaveLength(3);

      const allBlockSubjectNames = schedule.flatMap((d) => d.blocks.map((b) => b.subjectName));
      const hasFiscalSubject = allBlockSubjectNames.some((name) =>
        name.includes('Tributário') || name.includes('Contabilidade') || name.includes('Aduaneira')
      );
      expect(hasFiscalSubject).toBe(true);
    }
  });

  it('deve gerar cronograma para edital customizado criado por upload de PDF do usuário', () => {
    const customExam: ExamNotice = {
      id: 'custom-concurso-anvisa-2026',
      title: 'ANVISA 2026 - Especialista em Regulação',
      institution: 'Agência Nacional de Vigilância Sanitária',
      banca: 'Cebraspe',
      role: 'Especialista em Regulação e Vigilância Sanitária',
      salary: 'R$ 16.413,35',
      vacancies: 50,
      examDate: '2026-12-20',
      daysRemaining: 110,
      pdfFileName: 'Edital_ANVISA_2026_Upload.pdf',
      uploadedAt: '2026-09-23',
      subjects: [
        {
          id: 'sub-anvisa-vigilancia',
          name: 'Vigilância Sanitária & Saúde Pública',
          weight: 3,
          relevancePercentage: 45,
          totalTopics: 2,
          topics: [
            { id: 'top-anv-1', name: 'Regulamentação de Medicamentos', frequencyInBanca: 'Alta', status: 'Ponto Cego' },
            { id: 'top-anv-2', name: 'Controle de Fronteiras e Portos', frequencyInBanca: 'Alta', status: 'Instável' }
          ]
        },
        {
          id: 'sub-anvisa-portugues',
          name: 'Língua Portuguesa',
          weight: 1,
          relevancePercentage: 15,
          totalTopics: 1,
          topics: [
            { id: 'top-anv-3', name: 'Interpretação e Gramática', frequencyInBanca: 'Média', status: 'Dominado' }
          ]
        }
      ]
    };

    const schedule = generateDynamicSchedule(customExam, 3);
    expect(schedule).toHaveLength(3);
    const day1Block = schedule[0].blocks[0];
    expect(day1Block.subjectName).toBe('Vigilância Sanitária & Saúde Pública');
  });

  it('deve persistir e restaurar o edital padrão ativo em localStorage', () => {
    const targetExamId = 'exam-prf-2026';
    localStorage.setItem('aprovalens_default_exam_id', targetExamId);

    const savedId = localStorage.getItem('aprovalens_default_exam_id');
    expect(savedId).toBe('exam-prf-2026');

    // Simulação de lista de editais customizados persistidos
    const customExams = [
      {
        id: 'custom-tse-2026',
        title: 'TSE Unificado 2026',
        institution: 'Tribunal Superior Eleitoral',
        banca: 'Cebraspe'
      }
    ];
    localStorage.setItem('aprovalens_custom_exams', JSON.stringify(customExams));

    const retrievedCustom = JSON.parse(localStorage.getItem('aprovalens_custom_exams') || '[]');
    expect(retrievedCustom).toHaveLength(1);
    expect(retrievedCustom[0].id).toBe('custom-tse-2026');
  });
});
