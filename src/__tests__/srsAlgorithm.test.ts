import { describe, it, expect } from 'vitest';

/**
 * Função pura do algoritmo SuperMemo SM-2 para validação independente.
 */
function calculateSM2(
  quality: number, // 0 to 5
  previousRepetitions: number,
  previousInterval: number,
  previousEaseFactor: number
) {
  let repetitions = previousRepetitions;
  let intervalDays = previousInterval;
  let easeFactor = previousEaseFactor;

  if (quality >= 3) {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    intervalDays = 1;
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  return {
    repetitions,
    intervalDays,
    easeFactor: +easeFactor.toFixed(2),
  };
}

describe('Algoritmo de Repetição Espaçada SM-2 (Curva de Ebbinghaus)', () => {
  it('no primeiro acerto (nota 4), o intervalo deve ser de 1 dia e repetições = 1', () => {
    const result = calculateSM2(4, 0, 0, 2.5);
    expect(result.repetitions).toBe(1);
    expect(result.intervalDays).toBe(1);
    expect(result.easeFactor).toBe(2.5);
  });

  it('no segundo acerto consecutivo (nota 5), o intervalo deve saltar para 6 dias', () => {
    const result = calculateSM2(5, 1, 1, 2.5);
    expect(result.repetitions).toBe(2);
    expect(result.intervalDays).toBe(6);
    expect(result.easeFactor).toBe(2.6);
  });

  it('no terceiro acerto consecutivo (nota 4), o intervalo deve multiplicar pelo Ease Factor', () => {
    const result = calculateSM2(4, 2, 6, 2.6);
    expect(result.repetitions).toBe(3);
    // 6 * 2.6 = 15.6 -> arredondado para 16
    expect(result.intervalDays).toBe(16);
  });

  it('em caso de erro grave (nota 1 ou 2), deve resetar repetições para 0 e intervalo para 1 dia', () => {
    const result = calculateSM2(1, 4, 30, 2.6);
    expect(result.repetitions).toBe(0);
    expect(result.intervalDays).toBe(1);
    expect(result.easeFactor).toBeLessThan(2.6);
  });

  it('o Ease Factor nunca deve cair abaixo do piso mínimo de 1.3', () => {
    let ef = 1.4;
    for (let i = 0; i < 5; i++) {
      const step = calculateSM2(0, 0, 1, ef);
      ef = step.easeFactor;
    }
    expect(ef).toBe(1.3);
  });
});
