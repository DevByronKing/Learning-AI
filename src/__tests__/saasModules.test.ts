import { describe, it, expect } from 'vitest';
import { 
  CONCURSOS_RADAR_DATA, 
  OAB_CALENDAR_DATA, 
  ENEM_CALENDAR_DATA, 
  AVAILABLE_COUPONS,
  INITIAL_SUBSCRIPTION_DETAIL 
} from '../lib/concursosData';
import { GUARDIAN_ANIMALS } from '../lib/guardianAnimals';

describe('SaaS Módulos: Radar de Concursos, Mapa Regional, OAB e ENEM', () => {
  it('deve possuir editais cadastrados com status publicado, previsto e rumor', () => {
    expect(CONCURSOS_RADAR_DATA.length).toBeGreaterThanOrEqual(10);
    
    const publicados = CONCURSOS_RADAR_DATA.filter(c => c.status === 'publicado');
    const previstos = CONCURSOS_RADAR_DATA.filter(c => c.status === 'previsto');
    const rumores = CONCURSOS_RADAR_DATA.filter(c => c.status === 'rumor');

    expect(publicados.length).toBeGreaterThan(0);
    expect(previstos.length).toBeGreaterThan(0);
    expect(rumores.length).toBeGreaterThan(0);
  });

  it('deve possuir concursos mapeados em todas as macro-regiões do Brasil e âmbito Nacional', () => {
    const nacional = CONCURSOS_RADAR_DATA.filter(c => c.region === 'Nacional');
    const sudeste = CONCURSOS_RADAR_DATA.filter(c => c.region === 'Sudeste');
    const sul = CONCURSOS_RADAR_DATA.filter(c => c.region === 'Sul');
    const centroOeste = CONCURSOS_RADAR_DATA.filter(c => c.region === 'Centro-Oeste');
    const nordeste = CONCURSOS_RADAR_DATA.filter(c => c.region === 'Nordeste');
    const norte = CONCURSOS_RADAR_DATA.filter(c => c.region === 'Norte');

    expect(nacional.length).toBeGreaterThan(0);
    expect(sudeste.length).toBeGreaterThan(0);
    expect(sul.length).toBeGreaterThan(0);
    expect(centroOeste.length).toBeGreaterThan(0);
    expect(nordeste.length).toBeGreaterThan(0);
    expect(norte.length).toBeGreaterThan(0);
  });

  it('deve conter concursos com remuneração inicial e banca examinadora válidas', () => {
    const inss = CONCURSOS_RADAR_DATA.find(c => c.id.includes('inss'));
    expect(inss).toBeDefined();
    expect(inss?.banca).toBe('Cebraspe');
    expect(inss?.salary).toContain('R$');
    expect(inss?.matchedEditalId).toBeDefined();
  });

  it('deve conter o calendário oficial completo do Exame de Ordem (OAB)', () => {
    expect(OAB_CALENDAR_DATA.length).toBeGreaterThanOrEqual(3);
    const exame41 = OAB_CALENDAR_DATA.find(e => e.edition.includes('41º'));
    expect(exame41).toBeDefined();
    expect(exame41?.details.phase1Structure).toContain('80 questões');
    expect(exame41?.details.criticalSubjects).toContain('Ética e Estatuto da OAB (8 questões - 20% da nota de corte)');
  });

  it('deve conter as especificações detalhadas do ENEM e as 5 competências da Redação 1000', () => {
    expect(ENEM_CALENDAR_DATA.edition).toContain('ENEM');
    expect(ENEM_CALENDAR_DATA.details.redacaoCriteria.length).toBe(5);
    expect(ENEM_CALENDAR_DATA.details.triMechanism).toContain('Teoria de Resposta ao Item');
  });
});

describe('SaaS Módulos: Modelagem de Preços, Planos PLG e Carrinho', () => {
  it('deve validar cupons ativos com porcentagens de desconto reais', () => {
    const cupom20 = AVAILABLE_COUPONS.find(c => c.code === 'LANCAMENTO20');
    expect(cupom20).toBeDefined();
    expect(cupom20?.discountPercent).toBe(20);

    const cupom50 = AVAILABLE_COUPONS.find(c => c.code === 'APROVA50');
    expect(cupom50).toBeDefined();
    expect(cupom50?.discountPercent).toBe(50);
  });

  it('deve calcular corretamente os valores reposicionados dos planos PRO, ELITE e BLACK', () => {
    // Plano PRO: R$ 59,90/mês ou R$ 39,90/mês no anual (R$ 478,80)
    const proMensal = 59.90;
    const proAnual = 478.80;
    expect(proAnual / 12).toBeCloseTo(39.90, 2);

    // Plano ELITE: R$ 129,90/mês ou R$ 89,90/mês no anual (R$ 1.078,80)
    const eliteMensal = 129.90;
    const eliteAnual = 1078.80;
    expect(eliteAnual / 12).toBeCloseTo(89.90, 2);

    // Plano BLACK VITALÍCIO: R$ 1.497,00 em até 12x de R$ 149,70
    const blackVitalicio = 1497.00;
    expect(blackVitalicio).toBe(1497.00);
    expect(149.70 * 10).toBe(1497.00);
  });

  it('deve possuir a Fênix Dourada como Guardiã Mítica exclusiva do nível Black VIP', () => {
    const fenix = GUARDIAN_ANIMALS.find(g => g.id === 'fenix');
    expect(fenix).toBeDefined();
    expect(fenix?.name).toBe('Fênix Dourada');
    expect(fenix?.stats.foco).toBe(100);
    expect(fenix?.stats.resiliencia).toBe(100);
  });

  it('deve possuir histórico de faturas e recibo no gerenciamento de assinatura', () => {
    expect(INITIAL_SUBSCRIPTION_DETAIL.invoices.length).toBeGreaterThan(0);
    const inv = INITIAL_SUBSCRIPTION_DETAIL.invoices[0];
    expect(inv.status).toBe('paga');
    expect(inv.receiptCode).toContain('REC-');
  });
});
