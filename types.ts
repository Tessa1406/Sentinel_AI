export interface ConnectedNode {
  id: string;
  ip: string;
  status: "ONLINE" | "OFFLINE";
  lastSeen: string;
  metricLabel: string;
  metricValue: string;
}

export interface MotionEvent {
  timestamp: string;
  type: "INFO" | "WARN";
  node: string;
  message: string;
}

export interface ZoneCoverage {
  name: string;
  status: "ACTIVE" | "UNSTABLE";
  progress: number; // 0 to 100
}

export interface ActiveAlert {
  source: string;
  status: string;
  time: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  details?: string;
  remediation?: string;
  rawLog?: string;
}

export interface Vulnerability {
  id: string;
  title: string;
  cwe: string;
  severity: number;
  risk: "Critical" | "Medium" | "Low";
  remediationProposal: string;
  codeSnippet: string;
}

export interface Operator {
  name: string;
  tier: string;
  status: "ACTIVE" | "SUSPENDED";
}

export interface ChatMessage {
  id: string;
  sender: "SENTINEL_AI" | "OPERATOR";
  timestamp: string;
  text: string;
  code?: string;
  remediationTitle?: string;
  tags?: string[];
}
