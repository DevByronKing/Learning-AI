/**
 * Argus - Vulnerability & CVE Management Engine
 * Mapeamento e auditoria de vulnerabilidades conhecidas (CVEs) e pontuação CVSS.
 */

export interface KnownCveRecord {
  cveId: string;
  affectedPackage: string;
  fixedInVersion: string;
  cvssScore: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  owaspCategory: string;
}

// Catálogo de CVEs de referência monitoradas no ecossistema Node/Next.js
export const KNOWN_SECURITY_ADVISORIES: KnownCveRecord[] = [
  {
    cveId: 'CVE-2024-34351',
    affectedPackage: 'next',
    fixedInVersion: '14.2.24',
    cvssScore: 7.5,
    severity: 'HIGH',
    title: 'Server-Side Request Forgery (SSRF) no Next.js Server Actions',
    owaspCategory: 'A10:2021 - Server-Side Request Forgery',
  },
  {
    cveId: 'CVE-2023-45133',
    affectedPackage: 'babel-traverse',
    fixedInVersion: '7.23.2',
    cvssScore: 9.3,
    severity: 'CRITICAL',
    title: 'Execução Remota de Código arbitrária via compilação Babel',
    owaspCategory: 'A03:2021 - Injection',
  },
  {
    cveId: 'CVE-2022-25883',
    affectedPackage: 'semver',
    fixedInVersion: '7.5.2',
    cvssScore: 7.5,
    severity: 'HIGH',
    title: 'Regular Expression Denial of Service (ReDoS) em comparações de versões',
    owaspCategory: 'A05:2021 - Security Misconfiguration',
  },
];

export interface CveAuditReport {
  timestamp: string;
  totalDependenciesChecked: number;
  vulnerabilitiesFound: number;
  criticalCount: number;
  highCount: number;
  isCompliant: boolean;
  advisories: KnownCveRecord[];
}

/**
 * Realiza a auditoria de pacotes instalados confrontando com a base de CVEs.
 */
export function auditDependencyCves(installedPackages: Record<string, string>): CveAuditReport {
  const matchingAdvisories: KnownCveRecord[] = [];

  for (const [pkgName, version] of Object.entries(installedPackages)) {
    const cleanVersion = version.replace(/[\^~>=<]/g, '');
    const foundCve = KNOWN_SECURITY_ADVISORIES.find(
      (cve) => cve.affectedPackage === pkgName && cleanVersion < cve.fixedInVersion
    );
    if (foundCve) {
      matchingAdvisories.push(foundCve);
    }
  }

  const criticalCount = matchingAdvisories.filter((a) => a.severity === 'CRITICAL').length;
  const highCount = matchingAdvisories.filter((a) => a.severity === 'HIGH').length;

  return {
    timestamp: new Date().toISOString(),
    totalDependenciesChecked: Object.keys(installedPackages).length,
    vulnerabilitiesFound: matchingAdvisories.length,
    criticalCount,
    highCount,
    isCompliant: criticalCount === 0 && highCount === 0,
    advisories: matchingAdvisories,
  };
}
