/**
 * Learning AI - CLI de Ingestão de Provas Oficiais
 * Uso: npx tsx scripts/ingestExamCli.ts [opcoes]
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  parseAnswerKeyText,
  extractQuestionsWithRegex,
  crossReferenceWithAnswerKey,
  generatePostgresSql,
} from '../src/lib/questionExtractor';
import { ExamIngestionMetadata } from '../src/lib/types';
import {
  SAMPLE_CEBRASPE_PF_TEXT,
  SAMPLE_CEBRASPE_PF_KEY,
} from '../src/components/adminIngestSamples';

async function runCli() {
  console.log('\n============================================================');
  console.log('🚀 LEARNING AI - PIPELINE CLI DE INGESTÃO DE PROVAS');
  console.log('============================================================\n');

  const metadata: ExamIngestionMetadata = {
    title: 'Polícia Federal 2021 - Agente',
    banca: 'Cebraspe',
    institution: 'Polícia Federal',
    role: 'Agente de Polícia Federal',
    year: 2021,
    bookletColorOrCode: 'Caderno Branco',
    careerCategory: 'policial',
    sourceUrl: 'https://cebraspe.org.br',
  };

  console.log(`📋 Processando: ${metadata.institution} (${metadata.year}) - ${metadata.banca}`);
  console.log('1. Fazendo parser do gabarito oficial pós-recursos...');
  const parsedKey = parseAnswerKeyText(SAMPLE_CEBRASPE_PF_KEY);
  console.log(`   Gabarito: ${parsedKey.size} itens mapeados.`);

  console.log('2. Extraindo questões do caderno oficial com motor determinístico...');
  const rawQuestions = extractQuestionsWithRegex(SAMPLE_CEBRASPE_PF_TEXT, metadata);
  console.log(`   Extraídas: ${rawQuestions.length} questões.`);

  console.log('3. Cruzando questões com gabarito oficial definitivo e auditando...');
  const result = crossReferenceWithAnswerKey(rawQuestions, parsedKey, metadata);

  console.log('\n------------------------------------------------------------');
  console.log('📊 RESUMO DA AUDITORIA:');
  console.log(`   Total de Itens:        ${result.summary.totalQuestionsExtracted}`);
  console.log(`   Gabaritos Válidos:     ${result.summary.validQuestionsCount}`);
  console.log(`   Itens Anulados:        ${result.summary.annulledQuestionsCount}`);
  console.log(`   Normas Revogadas:      ${result.summary.alteredLegalNormsCount}`);
  console.log(`   Confiabilidade Média:  ${result.summary.averageConfidence}%`);
  console.log('------------------------------------------------------------\n');

  if (result.warnings.length > 0) {
    console.log('⚠️  ALERTAS REGISTRADOS:');
    result.warnings.forEach((w) => console.log(`   - ${w}`));
    console.log('');
  }

  // Grava arquivo SQL em scripts/output_provas.sql
  const outPath = path.join(__dirname, 'output_provas.sql');
  fs.writeFileSync(outPath, result.sqlInsertScript, 'utf8');
  console.log(`💾 Script SQL gerado com sucesso em: ${outPath}`);
  console.log('✅ Pipeline CLI finalizado com êxito!\n');
}

runCli().catch(console.error);
