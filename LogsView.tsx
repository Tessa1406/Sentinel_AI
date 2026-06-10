import { useState, useRef, useEffect, FormEvent } from "react";
import { ActiveAlert } from "../types";
import { 
  Terminal, 
  Search, 
  Trash2, 
  Download, 
  Play, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle,
  FileCode
} from "lucide-react";

interface LogsViewProps {
  alerts: ActiveAlert[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClearLogs: () => void;
}

export default function LogsView({
  alerts,
  searchQuery,
  setSearchQuery,
  onClearLogs
}: LogsViewProps) {
  
  // Interactive terminal console commands
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutputs, setTerminalOutputs] = useState<string[]>([
    "CYBER_SHELL [Version 9.4.1011]",
    "Initializing Sentinel Kernel... SECURE_INIT_OK",
    "Type 'help' to list available command utilities."
  ]);
  
  const terminalBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalOutputs]);

  // Terminal commands handling
  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const outputs = [...terminalOutputs, `operator@sentinel:~$ ${terminalInput}`];
    
    switch (cmd) {
      case "help":
        outputs.push(
          "Available command parameters:",
          "  status          Check global firegrid firewall states",
          "  scan-ports      Trigger TCP/UDP diagnostic probes on nodes",
          "  clear           Reset command logs dashboard console",
          "  whoami          List diagnostic credentials",
          "  logs-audit      Analyze server access endpoints logs"
        );
        break;
      case "status":
        outputs.push(
          "🛡️ SYSTEM HEALTH OVERVIEW:",
          "  -> FireGrid Port Check: ACTIVE",
          "  -> Intrusion Perimeter: MONITORING",
          "  -> Dynamic Sandbox Runtime: OK",
          "  -> Operational Nodes: 12/12 SYNCHRONIZED"
        );
        break;
      case "scan-ports":
        outputs.push(
          "⚡ LAUNCHING DIAGNOSTIC SENSOR SCAN...",
          "  Scanning node 10.0.8.1 ... [SECURE]",
          "  Scanning node 10.0.8.2 ... [SECURE]",
          "  Scanning node 10.0.8.3 ... [SECURE]",
          "  Port scans complete. Vulnerabilities: 0 open diagnostic ports."
        );
        break;
      case "whoami":
        outputs.push(
          "Operator Identity Matrix:",
          "  Tier: LEVEL_0 SECURE CORE OPERATOR",
          "  Session Ingress Origin: INTERNAL_PROXY",
          "  Access Domain: SENTINEL_AI SYSTEM_ROOT"
        );
        break;
      case "logs-audit":
        outputs.push(
          "🔍 PARSING FILELOG ENDPOINTS:",
          "  [12:00:15] GET /api/v1/sensors/data -> Status 200 (Length: 124 bytes)",
          "  [11:58:32] POST /api/v1/user/auth -> Blocked suspicious SQL bypass query limit"
        );
        break;
      case "clear":
        setTerminalOutputs([]);
        setTerminalInput("");
        return;
      default:
        outputs.push(`bash: command utility parameters mismatch: '${terminalInput}'. Try 'help'.`);
    }

    setTerminalOutputs(outputs);
    setTerminalInput("");
  };

  // Filter alerts by search query
  const filteredAlerts = alerts.filter((alert) => {
    const q = searchQuery.toLowerCase();
    return (
      alert.source.toLowerCase().includes(q) ||
      alert.severity.toLowerCase().includes(q) ||
      alert.status.toLowerCase().includes(q) ||
      (alert.details && alert.details.toLowerCase().includes(q))
    );
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse";
      case "HIGH":
        return "bg-orange-500/10 text-orange-400 border border-orange-500/30";
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    }
  };

  // Safe JSON extraction to file download
  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alerts, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "sentinel_cyber_alerts.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#30363d]/30 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-black font-sans text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-6 h-6 text-[#00a3ff]" />
            Operator Shell Command Logs
          </h1>
          <p className="text-xs font-mono text-[#bec7d4] mt-1">
            Analyze historical network logs, CVE intrusion logs, or execute direct probe shell diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171c22] hover:bg-[#262a30] text-xs font-mono font-bold text-white border border-[#30363d] rounded active:scale-95 transition-all text-center"
          >
            <Download className="w-3.5 h-3.5" />
            Export Alert JSON
          </button>
          
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/10 hover:bg-red-950/30 text-xs font-mono font-bold text-red-400 border border-red-500/20 rounded active:scale-95 transition-all text-center"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset Alerts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Real-time Interactive Command Terminal Core */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#11141a] border border-[#30363d] rounded-lg overflow-hidden flex flex-col h-[480px] shadow-2xl relative">
            <div className="bg-[#171c22] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#bec7d4] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                CYBERCORE SH_TERMINAL
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                ttyS001 Active
              </span>
            </div>

            {/* Terminal logs body scrolling */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-[#00e639] space-y-2 terminal-scroll bg-[#0b0e14]">
              {terminalOutputs.map((out, idx) => (
                <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                  {out}
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            {/* Terminal input form */}
            <form onSubmit={handleCommandSubmit} className="bg-[#171c22] border-t border-[#30363d] p-3 flex items-center gap-2">
              <span className="font-mono text-xs text-[#00a3ff] font-bold">operator@sentinel:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                autoComplete="off"
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-white font-mono text-xs placeholder-[#bec7d4]/30"
                placeholder="Type command (e.g. 'status', 'scan-ports', 'help')..."
              />
              <button 
                type="submit" 
                className="p-1 px-3 bg-[#00a3ff] hover:brightness-110 text-black rounded text-[10px] uppercase font-bold font-mono active:scale-95 transition-all text-center"
              >
                Execute
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Log alerts database check list */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#161b22] border border-[#30363d]/50 rounded-lg p-5 flex flex-col h-[480px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="text-amber-400 w-4 h-4" />
                Active Cyber Perimeter Intrusion Alerts
              </h2>
              <span className="text-xs font-mono text-[#88919d]">
                ({filteredAlerts.length} filtered)
              </span>
            </div>

            {/* Search filter input */}
            <div className="mb-4 flex items-center bg-[#171c22] border border-[#30363d] px-3 py-1.5 rounded group">
              <Search className="w-3.5 h-3.5 text-[#88919d] mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none focus:ring-0 text-xs font-mono w-full text-white placeholder-[#bec7d4]/30"
                placeholder="Type to filter alerts list (e.g. 'Critical', 'auth', 'node')..."
              />
            </div>

            {/* Scrolling list */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 terminal-scroll">
              {filteredAlerts.map((alert, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-[#171c22] border border-[#30363d] hover:border-[#88919d]/40 rounded transition-all space-y-1.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-[#00a3ff] uppercase tracking-wider font-bold">
                        {alert.source}
                      </span>
                      <p className="text-xs font-bold text-white mt-0.5">{alert.status}</p>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>

                  {alert.details && (
                    <p className="text-[11px] text-[#bec7d4] font-mono leading-relaxed bg-[#0b0e14]/50 p-2 rounded border border-[#30363d]/40">
                      {alert.details}
                    </p>
                  )}

                  <div className="flex justify-between items-center text-[10px] text-[#88919d] font-mono pt-1">
                    <span>TIME: {alert.time}</span>
                    {alert.remediation && (
                      <span className="text-[#00e639] flex items-center gap-1 font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        Remediated Secure
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filteredAlerts.length === 0 && (
                <div className="py-16 text-center text-xs font-mono text-[#88919d] space-y-2">
                  <Flame className="w-6 h-6 text-[#bec7d4]/40 mx-auto" />
                  <p>No logged critical threat events match filter constraints.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
