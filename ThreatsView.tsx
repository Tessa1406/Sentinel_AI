import { useState } from "react";
import { Vulnerability } from "../types";
import { 
  ShieldAlert, 
  Code, 
  Check, 
  X, 
  Terminal, 
  AlertTriangle, 
  Zap, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  Bot
} from "lucide-react";

interface ThreatsViewProps {
  onDeployPatch: () => void;
  onAskAI: (prompt: string) => void;
}

export default function ThreatsView({ onDeployPatch, onAskAI }: ThreatsViewProps) {
  
  // High fidelity CVE security records
  const initialVulnerabilities: Vulnerability[] = [
    {
      id: "CVE-2024-8812",
      title: "SQL Injection in User Authentication Router",
      cwe: "CWE-89: Improper Neutralization of Special Elements used in an SQL Command",
      severity: 9.8,
      risk: "Critical",
      remediationProposal: "Implement parameterized statement bindings instead of string concat querying.",
      codeSnippet: `// ❌ VULNERABLE CONTROLLER (auth.ts)\napp.post("/api/v1/auth", async (req, res) => {\n  const { username, password } = req.body;\n  // Direct interpolation lets attackers bypass login checks \n  const query = \`SELECT * FROM users WHERE user = '\${username}' AND pass = '\${password}'\`;\n  const result = await db.query(query);\n  ...\n});`
    },
    {
      id: "CVE-2023-4412",
      title: "Insecure Cross-Origin Resource Sharing (CORS)",
      cwe: "CWE-942: Permissive CORS Access Control Policy",
      severity: 6.5,
      risk: "Medium",
      remediationProposal: "Strictly restrict Access-Control-Allow-Origin parameters to specific verified domains.",
      codeSnippet: `// ❌ VULNERABLE CONFIGURATION (cors.ts)\n// Allowing wildcard roots risks cross-site account takeover leaks\napp.use(cors({\n  origin: "*",\n  credentials: true\n}));`
    },
    {
      id: "CVE-2024-1011",
      title: "Raw Buffer Overreach in Binary Uplink",
      cwe: "CWE-120: Buffer Copy without Checking Size of Input",
      severity: 8.4,
      risk: "Critical",
      remediationProposal: "Incorporate strict input length validators and size checks before block allocation.",
      codeSnippet: `// ❌ VULNERABLE PARSING BUFFER (uplink.cpp)\nvoid parseUplink(char* packetData, int packetSize) {\n  char buffer[128];\n  // Unchecked strcpy overflows memory space if input has size > 128 bytes\n  strcpy(buffer, packetData);\n  ...\n}`
    }
  ];

  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(initialVulnerabilities);
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability>(initialVulnerabilities[0]);
  const [isPatched, setIsPatched] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"code" | "guideline">("code");

  // Get parameterized secure patch code representation
  const getSecurePatchCode = (id: string) => {
    switch(id) {
      case "CVE-2024-8812":
        return `// ✅ REMEDIATED & SECURE CONTROLLER (auth.ts)\napp.post("/api/v1/auth", async (req, res) => {\n  const { username, password } = req.body;\n  \n  // Parameterized bindings block threat elements permanently\n  const query = "SELECT * FROM users WHERE user = $1 AND pass = $2";\n  const result = await db.query(query, [username, password]);\n  ...\n});`;
      case "CVE-2023-4412":
        return `// ✅ REMEDIATED & SECURE CONFIGURATION (cors.ts)\nconst allowedOrigins = ["https://sentinel.ai", "https://portal.sentinel.ai"];\napp.use(cors({\n  origin: (origin, callback) => {\n    if (!origin || allowedOrigins.indexOf(origin) !== -1) {\n      callback(null, true);\n    } else {\n      callback(new Error('Blocked by CORS Sentinel Policy'));\n    }\n  },\n  credentials: true\n}));`;
      case "CVE-2024-1011":
        return `// ✅ REMEDIATED & SECURE PARSING BUFFER (uplink.cpp)\nvoid parseUplink(char* packetData, int packetSize) {\n  char buffer[128];\n  // Enforced safety limits with strncpy protect allocation limits\n  if (packetSize >= 128) {\n    return; // Block execution and warn\n  }\n  strncpy(buffer, packetData, 127);\n  buffer[127] = '\\0'; // Safe null termination\n  ...\n}`;
      default:
        return "// Remediation complete.";
    }
  };

  const handleApplyLocalPatch = (id: string) => {
    setIsPatched(prev => ({ ...prev, [id]: true }));
    onDeployPatch();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* View Header */}
      <div className="border-b border-[#30363d]/30 pb-4">
        <h1 className="text-2xl font-black font-sans text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-400" />
          Vulnerability Perimeter Scanner
        </h1>
        <p className="text-xs font-mono text-[#bec7d4] mt-1">
          Perform source inspections and deploy parameterized patches to static code bases.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: CVE records list */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-[#161b22] border border-[#30363d]/50 rounded-lg p-4">
            <h2 className="text-xs font-mono font-bold text-[#88919d] uppercase mb-3 tracking-wide">
              DISCOVERED WEAKNESSES ({vulnerabilities.length})
            </h2>

            <div className="space-y-2.5">
              {vulnerabilities.map((vuln) => {
                const isVulnPatched = isPatched[vuln.id];
                const isSelected = selectedVuln.id === vuln.id;

                return (
                  <div
                    key={vuln.id}
                    onClick={() => setSelectedVuln(vuln)}
                    className={`p-3.5 rounded border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected 
                        ? "bg-[#171c22] border-[#00a3ff]" 
                        : "bg-[#171c22]/50 border-[#30363d] hover:border-[#88919d]/40"
                    }`}
                  >
                    {/* Glowing status strip */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      isVulnPatched ? "bg-[#00e639]" : "bg-[#ff6e63]"
                    }`} />

                    <div className="flex justify-between items-start mb-1.5 pl-2">
                      <span className="font-mono text-xs font-black text-white">{vuln.id}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isVulnPatched 
                          ? "bg-[#00e639]/10 text-[#00e639]" 
                          : "bg-red-500/10 text-red-400 animate-pulse"
                      }`}>
                        {isVulnPatched ? "PATCHED SECURE" : "UNSTABLE"}
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-[#dfe3ea] pl-2 line-clamp-1">{vuln.title}</h3>
                    
                    <div className="mt-2.5 pl-2 flex justify-between items-center text-[10px] font-mono">
                      <span className="text-[#88919d]">SCORE:</span>
                      <span className={`font-bold ${vuln.severity >= 8.5 ? "text-red-400" : "text-amber-400"}`}>
                        {vuln.severity} ({vuln.severity >= 8.5 ? "CRITICAL" : "HIGH"})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips for operators */}
          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg space-y-2 text-xs">
            <h4 className="font-bold text-[#98cbff] flex items-center gap-1.5">
              <Code className="w-4 h-4" />
              CYBER_SHELL Guidelines
            </h4>
            <p className="text-[#bec7d4] leading-relaxed text-[11px]">
              Sentinel AI autonomously analyses logs to find attack patterns like SQL bypass strings and buffer limits. Injecting secure parameter bindings prevents database spoofing.
            </p>
          </div>
        </div>

        {/* Right Side: Active Inspector detailing Code Exploit and Secure Remediation */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#161b22] border border-[#30363d]/50 rounded-lg overflow-hidden">
            
            {/* Tab header */}
            <div className="flex justify-between items-center bg-[#171c22] border-b border-[#30363d] px-5 py-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00a3ff]" />
                <span className="font-mono text-xs font-bold text-white uppercase">
                  Perimeter Audit Code Inspection: {selectedVuln.id}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("code")}
                  className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                    activeTab === "code" ? "bg-[#30363d] text-white" : "text-[#88919d] hover:text-white"
                  }`}
                >
                  SOURCE EDITOR
                </button>
                <button
                  onClick={() => setActiveTab("guideline")}
                  className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                    activeTab === "guideline" ? "bg-[#30363d] text-white" : "text-[#88919d] hover:text-white"
                  }`}
                >
                  REMEDIATION ADVISORIES
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Vuln summary */}
              <div>
                <h3 className="text-white font-bold text-sm mb-1">{selectedVuln.title}</h3>
                <p className="text-xs font-mono text-[#88919d]">{selectedVuln.cwe}</p>
              </div>

              {activeTab === "code" ? (
                <div className="space-y-4">
                  {/* Exploit block vs remediated block toggler animation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="font-mono text-[10px] font-bold text-red-400 uppercase flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5 bg-red-500/10 rounded-full" />
                        Vulnerable Code Base
                      </span>
                      <pre className="p-3 bg-red-950/10 border border-red-500/15 rounded text-[10px] font-mono overflow-x-auto text-[#ffa49e] max-h-52 leading-tight">
                        <code>{selectedVuln.codeSnippet}</code>
                      </pre>
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-mono text-[10px] font-bold text-[#00e639] uppercase flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 bg-emerald-500/10 rounded-full" />
                        Secure Sanitize Patch
                      </span>
                      <pre className="p-3 bg-emerald-950/10 border border-emerald-500/15 rounded text-[10px] font-mono overflow-x-auto text-[#a2ffd0] max-h-52 leading-tight">
                        <code>{getSecurePatchCode(selectedVuln.id)}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Patch action buttons */}
                  <div className="pt-3 border-t border-[#30363d]/30 flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-[#00a3ff]" />
                      <button
                        onClick={() => onAskAI(`Explain how to patch ${selectedVuln.id}: ${selectedVuln.title} using best practices.`)}
                        className="text-[11px] font-mono text-[#98cbff] hover:underline"
                      >
                        Ask Sentinel AI to analyze vulnerability details
                      </button>
                    </div>

                    <button
                      onClick={() => handleApplyLocalPatch(selectedVuln.id)}
                      disabled={isPatched[selectedVuln.id]}
                      className={`px-4 py-2 rounded text-xs font-mono font-bold active:scale-95 transition-all text-center flex items-center gap-1.5 ${
                        isPatched[selectedVuln.id]
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-[#00a3ff] hover:brightness-110 text-black shadow"
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {isPatched[selectedVuln.id] ? "PATCH APPLIED VERIFIED" : "DEPLOY STATIC REFACTOR"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 font-sans text-xs text-[#bec7d4] leading-relaxed">
                  <div className="bg-[#171c22] p-4 rounded border border-[#30363d]">
                    <h4 className="font-bold text-white mb-2 uppercase font-mono text-[11px] text-[#00a3ff]">Suggested Patching Protocol:</h4>
                    <p>{selectedVuln.remediationProposal}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-white uppercase font-mono text-[11px] text-[#ff6e63]">Industry Compliance Rules (SOC2/ISO):</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Never write SQL query inputs using direct string substitution or ES6 string literals templates.</li>
                      <li>Incorporate strict CORS regulations dynamically, avoiding the wildcard <code>*</code> parameter entirely.</li>
                      <li>Conduct static scans during standard commit builds before staging.</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => onAskAI(`What are the compliance implications of CWE for ${selectedVuln.title}?`)}
                    className="mt-4 px-4 py-2 bg-[#171c22] hover:bg-[#262a30] text-[#bec7d4] border border-[#30363d] rounded font-mono text-xs font-bold transition-all text-center flex items-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#00a3ff]" />
                    Review Compliance Framework on AI
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
