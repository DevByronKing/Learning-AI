/**
 * Argus - DevSecOps Automated Security Gate & SAST Scanner
 * Script executado em pipelines de CI/CD para validação rigorosa de segurança antes do build.
 */

import fs from 'fs';
import path from 'path';
import { auditDependencyCves } from '../src/lib/cveAuditor';

interface DevSecOpsResult {
  sastClean: boolean;
  cveClean: boolean;
  headersCompliant: boolean;
  overallPassed: boolean;
  details: string[];
}

export function runDevSecOpsPipeline(): DevSecOpsResult {
  const details: string[] = [];
  let sastClean = true;
  let cveClean = true;
  let headersCompliant = true;

  // 1. SAST: Varredura de Segredos Hardcoded em arquivos críticos
  const criticalDirs = [path.join(process.cwd(), 'src')];
  const secretPatterns = [
    /(?:AKIA[0-9A-Z]{16})/, // AWS Access Key
    /(?:ghp_[0-9a-zA-Z]{36})/, // GitHub Token
    /-----BEGIN RSA PRIVATE KEY-----/,
    /-----BEGIN OPENSSH PRIVATE KEY-----/,
  ];

  function scanDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
          scanDir(fullPath);
        }
      } else if (/\.(ts|tsx|js|json)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const pattern of secretPatterns) {
          if (pattern.test(content)) {
            sastClean = false;
            details.push(`[SAST ALERTA]: Possível segredo hardcoded detectado em ${entry.name}`);
          }
        }
      }
    }
  }

  criticalDirs.forEach(scanDir);
  if (sastClean) {
    details.push('[SAST OK]: Nenhum segredo sensível hardcoded detectado no código-fonte.');
  }

  // 2. Análise de CVEs de Dependências (package.json)
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const dependencies = { ...(pkgJson.dependencies || {}), ...(pkgJson.devDependencies || {}) };
    const cveReport = auditDependencyCves(dependencies);

    if (cveReport.isCompliant) {
      details.push(`[CVE OK]: ${cveReport.totalDependenciesChecked} dependências auditadas. Zero vulnerabilidades críticas.`);
    } else {
      cveClean = false;
      details.push(`[CVE FALHA]: ${cveReport.vulnerabilitiesFound} vulnerabilidade(s) encontrada(s).`);
    }
  }

  // 3. Verificação de Middleware Security Headers
  const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts');
  if (fs.existsSync(middlewarePath)) {
    const mwContent = fs.readFileSync(middlewarePath, 'utf8');
    const requiredHeaders = ['Strict-Transport-Security', 'Content-Security-Policy', 'X-Frame-Options', 'X-Content-Type-Options'];
    const missing = requiredHeaders.filter((h) => !mwContent.includes(h));
    if (missing.length > 0) {
      headersCompliant = false;
      details.push(`[HEADERS FALHA]: Cabeçalhos ausentes no middleware: ${missing.join(', ')}`);
    } else {
      details.push('[HEADERS OK]: Todos os cabeçalhos OWASP Top 10 e HSTS verificados.');
    }
  }

  const overallPassed = sastClean && cveClean && headersCompliant;
  return {
    sastClean,
    cveClean,
    headersCompliant,
    overallPassed,
    details,
  };
}

// Execução direta via Node/ts-node se chamado pelo terminal
if (typeof require !== 'undefined' && require.main === module) {
  const result = runDevSecOpsPipeline();
  console.log('=== RELATÓRIO DO PIPELINE DEVSECOPS ARGUS ===');
  result.details.forEach((d) => console.log(d));
  if (!result.overallPassed) {
    console.error('Pipeline DevSecOps bloqueado por falha nos critérios de segurança.');
    process.exit(1);
  } else {
    console.log('Pipeline DevSecOps APROVADO com sucesso.');
    process.exit(0);
  }
}
