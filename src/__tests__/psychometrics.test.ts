import { describe, it, expect } from 'vitest';
import { 
  PSYCHOMETRIC_DISTRACTORS, 
  BANCA_PSYCHOMETRIC_PROFILES 
} from '../lib/psychometricsData';

describe('Psicometria Educacional & Arquétipos de Distratores', () => {
  it('deve possuir todos os 8 arquétipos universais de distratores catalogados', () => {
    expect(PSYCHOMETRIC_DISTRACTORS).toHaveLength(8);
    const ids = PSYCHOMETRIC_DISTRACTORS.map((d) => d.id);
    expect(ids).toContain('generalizacao_indevida');
    expect(ids).toContain('conceito_correto_contexto_errado');
    expect(ids).toContain('meia_verdade');
    expect(ids).toContain('senso_comum');
    expect(ids).toContain('armadilha_semantica');
    expect(ids).toContain('distrator_temporal');
    expect(ids).toContain('inversao_competencia');
    expect(ids).toContain('lei_revogada');
  });

  it('cada distrator deve conter lógica do examinador e estratégia antídoto não-vazia', () => {
    PSYCHOMETRIC_DISTRACTORS.forEach((distractor) => {
      expect(distractor.name.length).toBeGreaterThan(5);
      expect(distractor.examinerLogic.length).toBeGreaterThan(20);
      expect(distractor.antidoteStrategy.length).toBeGreaterThan(20);
      expect(['Crítica', 'Alta', 'Moderada']).toContain(distractor.severity);
    });
  });

  it('deve cobrir perfis psicométricos das principais bancas do Brasil', () => {
    const bancas = BANCA_PSYCHOMETRIC_PROFILES.map((p) => p.banca);
    expect(bancas).toContain('Cebraspe');
    expect(bancas).toContain('FGV');
    expect(bancas).toContain('FCC');
    expect(bancas).toContain('Vunesp');

    const fgv = BANCA_PSYCHOMETRIC_PROFILES.find((p) => p.banca === 'FGV');
    expect(fgv).toBeDefined();
    expect(fgv!.primaryDistractor).toBe('armadilha_semantica');
    expect(fgv!.discriminationEfficiency).toBeGreaterThan(90);
  });

  it('cada banca deve possuir distribuição percentual total de 100% de distratores', () => {
    BANCA_PSYCHOMETRIC_PROFILES.forEach((profile) => {
      const sum = profile.distractorDistribution.reduce((acc, d) => acc + d.percentage, 0);
      expect(sum).toBe(100);
      expect(profile.totalQuestionsMapped).toBeGreaterThan(5000);
    });
  });
});
