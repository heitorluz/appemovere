export interface Finding {
  readonly path: string;
  readonly line?: number;
  readonly rule: string;
  readonly message: string;
}

export function formatFinding(finding: Finding): string {
  const location = finding.line === undefined ? finding.path : `${finding.path}:${finding.line}`;
  return `${location} ${finding.rule} — ${finding.message}`;
}

export function formatFindings(findings: readonly Finding[]): string {
  return findings.map(formatFinding).join('\n');
}

export function exitCodeFor(findings: readonly Finding[]): 0 | 1 {
  return findings.length === 0 ? 0 : 1;
}
