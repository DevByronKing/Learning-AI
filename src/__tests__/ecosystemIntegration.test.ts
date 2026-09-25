import { describe, it, expect } from 'vitest';
import { INITIAL_EXAMS, INITIAL_VADE_MECUM, INITIAL_MISTAKES } from '../lib/mockData';
import { CONCURSOS_RADAR_DATA, OAB_CALENDAR_DATA } from '../lib/concursosData';
import { MOCK_DISCURSIVE_PROMPTS } from '../lib/mockData';
import { ExamNotice } from '../lib/types';

describe('Ecossistema Interligado pelo Concurso / OAB', () => {
  const oabExam = INITIAL_EXAMS.find(e => e.id === 'exam-oab-43')!;
  const pfExam = INITIAL_EXAMS.find(e => e.id === 'exam-pf-2026')!;
  const inssExam = INITIAL_EXAMS.find(e => e.id === 'exam-inss-2026')!;
  const receitaExam = INITIAL_EXAMS.find(e => e.id === 'exam-receita-2026')!;

  it('deve ter todos os concursos centrais configurados no repositório de editais', () => {
    expect(oabExam).toBeDefined();
    expect(pfExam).toBeDefined();
    expect(inssExam).toBeDefined();
    expect(receitaExam).toBeDefined();
    expect(oabExam.banca).toBe('FGV');
    expect(pfExam.banca).toBe('Cebraspe');
    expect(receitaExam.banca).toBe('FGV');
  });

  describe('Radar Nacional -> Ecossistema', () => {
    it('deve mapear matchedEditalId do Radar diretamente para editais válidos do ecossistema', () => {
      const inssRadar = CONCURSOS_RADAR_DATA.find(c => c.matchedEditalId === 'exam-inss-2026');
      const pfRadar = CONCURSOS_RADAR_DATA.find(c => c.matchedEditalId === 'exam-pf-2026');
      const receitaRadar = CONCURSOS_RADAR_DATA.find(c => c.matchedEditalId === 'exam-receita-2026');

      expect(inssRadar).toBeDefined();
      expect(pfRadar).toBeDefined();
      expect(receitaRadar).toBeDefined();

      // Verificar que o ID mapeado existe em INITIAL_EXAMS
      expect(INITIAL_EXAMS.some(e => e.id === inssRadar?.matchedEditalId)).toBe(true);
      expect(INITIAL_EXAMS.some(e => e.id === pfRadar?.matchedEditalId)).toBe(true);
      expect(INITIAL_EXAMS.some(e => e.id === receitaRadar?.matchedEditalId)).toBe(true);
    });

    it('deve conter as edições da OAB com estrutura de 1ª e 2ª Fase vinculadas ao calendário FGV', () => {
      expect(OAB_CALENDAR_DATA.length).toBeGreaterThanOrEqual(3);
      const oab41 = OAB_CALENDAR_DATA.find(o => o.edition.includes('41º'));
      expect(oab41).toBeDefined();
      expect(oab41?.details.banca).toContain('FGV');
      expect(oab41?.details.criticalSubjects).toContain('Ética e Estatuto da OAB (8 questões - 20% da nota de corte)');
    });
  });

  describe('Vade Mecum Inteligente -> Calibração por Concurso Ativo', () => {
    it('deve priorizar artigos de Ética/Estatuto da OAB quando o concurso ativo for OAB', () => {
      const oabLawArticles = INITIAL_VADE_MECUM.filter(art => 
        art.tags.includes('oab') || 
        art.diploma.includes('OAB') ||
        oabExam.subjects.some(s => art.tags.some(t => s.name.toLowerCase().includes(t.toLowerCase())))
      );

      expect(oabLawArticles.length).toBeGreaterThan(0);
      const estatutoArt = oabLawArticles.find(a => a.diploma.includes('OAB') || a.tags.includes('oab'));
      expect(estatutoArt).toBeDefined();
      expect(estatutoArt?.numberStr).toContain('Art. 28');
    });

    it('deve priorizar crimes funcionais e legislação penal quando o concurso ativo for Polícia Federal', () => {
      const pfLawArticles = INITIAL_VADE_MECUM.filter(art =>
        art.tags.includes('policial') ||
        art.tags.includes('penal') ||
        pfExam.subjects.some(s => art.tags.some(t => s.name.toLowerCase().includes(t.toLowerCase())))
      );

      expect(pfLawArticles.length).toBeGreaterThan(0);
      const peculatoArt = pfLawArticles.find(a => a.title.toLowerCase().includes('peculato'));
      expect(peculatoArt).toBeDefined();
      expect(peculatoArt?.diploma).toContain('Código Penal');
    });

    it('deve priorizar direito tributário e CTN quando o concurso ativo for Receita Federal', () => {
      const receitaArticles = INITIAL_VADE_MECUM.filter(art =>
        art.tags.includes('fiscal') ||
        art.tags.includes('tributario') ||
        receitaExam.subjects.some(s => art.tags.some(t => s.name.toLowerCase().includes(t.toLowerCase())))
      );

      expect(receitaArticles.length).toBeGreaterThan(0);
      const ctnArt = receitaArticles.find(a => a.diploma.includes('CTN') || a.tags.includes('tributario'));
      expect(ctnArt).toBeDefined();
      expect(ctnArt?.numberStr).toContain('Art. 151');
    });
  });

  describe('Studio de Discursivas & Peças -> Alinhamento por Concurso', () => {
    it('deve filtrar e calibrar peças práticas da OAB quando o edital for OAB', () => {
      const oabPrompts = MOCK_DISCURSIVE_PROMPTS.filter(p =>
        (p.banca === 'OAB' || p.banca === 'FGV' || p.institution.toLowerCase().includes('oab')) &&
        (p.role.toLowerCase().includes('advogado') || p.area.toLowerCase().includes('jurídica'))
      );

      expect(oabPrompts.length).toBeGreaterThan(0);
      const pecaOab = oabPrompts.find(p => p.role.includes('2ª Fase') || p.institution.includes('OAB'));
      expect(pecaOab).toBeDefined();
      expect(pecaOab?.role).toContain('Advogado');
    });

    it('deve calibrar temas de segurança pública Cebraspe para Polícia Federal', () => {
      const pfPrompts = MOCK_DISCURSIVE_PROMPTS.filter(p =>
        p.banca === 'Cebraspe' && (p.area.toLowerCase().includes('policial') || p.role.toLowerCase().includes('polícia'))
      );

      expect(pfPrompts.length).toBeGreaterThan(0);
      expect(pfPrompts[0].banca).toBe('Cebraspe');
      expect(pfPrompts[0].institution).toContain('Polícia Federal');
    });
  });

  describe('Caderno de Erros Estratégico -> Filtro por Edital Ativo', () => {
    it('deve filtrar erros com precisão quando filterOnlyActiveExam estiver ligado', () => {
      // Simular filtro de erros para o edital do INSS (Banca Cebraspe)
      const inssMistakes = INITIAL_MISTAKES.filter(m => {
        const matchBanca = m.question.banca.toLowerCase() === inssExam.banca.toLowerCase();
        const matchSubject = inssExam.subjects.some(sub =>
          sub.name.toLowerCase().includes(m.question.subjectName.toLowerCase()) ||
          m.question.subjectName.toLowerCase().includes(sub.name.toLowerCase())
        );
        return matchBanca || matchSubject;
      });

      expect(inssMistakes.length).toBeGreaterThan(0);
      // Cada erro do INSS deve apontar para banca Cebraspe ou matéria do INSS
      inssMistakes.forEach(m => {
        const isBancaOrSubject = m.question.banca === 'Cebraspe' || 
          inssExam.subjects.some(s => s.name.toLowerCase().includes(m.question.subjectName.toLowerCase()));
        expect(isBancaOrSubject).toBe(true);
      });
    });
  });
});
