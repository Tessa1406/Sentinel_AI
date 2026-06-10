import { useState, FormEvent } from "react";
import { 
  Settings, 
  User, 
  Sliders, 
  Database, 
  ShieldAlert, 
  Save, 
  HelpCircle, 
  RefreshCw,
  Trash2,
  Lock,
  CheckCircle,
  Eye,
  Activity
} from "lucide-react";

interface SettingsViewProps {
  userEmail: string;
  onUpdateOperatorEmail: (email: string) => void;
  onResetSystemState: () => void;
}

export default function SettingsView({
  userEmail,
  onUpdateOperatorEmail,
  onResetSystemState
}: SettingsViewProps) {
  
  // Settings form states
  const [operatorEmail, setOperatorEmail] = useState(userEmail);
  const [protectionLevel, setProtectionLevel] = useState("automatic");
  const [severityFilter, setSeverityFilter] = useState("HIGH");
  const [logRefreshRate, setLogRefreshRate] = useState(10);
  const [isSaved, setIsSaved] = useState(false);

  // Simulated save action
  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    onUpdateOperatorEmail(operatorEmail);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-[#30363d]/30 pb-4">
        <h1 className="text-2xl font-black font-sans text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#98cbff]" />
          System Settings & Operator Profiles
        </h1>
        <p className="text-xs font-mono text-[#bec7d4] mt-1">
          Configure security protection tiers, alert thresholds, and diagnostic variables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: General Configurations Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSaveSettings} className="bg-[#161b22] border border-[#30363d]/50 rounded-lg p-5 space-y-6">
            
            {/* Operator section */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#30363d]/40 pb-2">
                <User className="w-4 h-4 text-[#00a3ff]" />
                Operator Identity Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#bec7d4] uppercase">Operator Email Identity</label>
                  <input
                    type="email"
                    required
                    value={operatorEmail}
                    onChange={(e) => setOperatorEmail(e.target.value)}
                    className="w-full bg-[#171c22] border border-[#30363d] focus:border-[#00a3ff] rounded p-2.5 outline-none text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#bec7d4] uppercase">Operational Authorization tier</label>
                  <input
                    type="text"
                    disabled
                    value="LEVEL_0 SECURE CORE OPERATOR"
                    className="w-full bg-[#0b0e14] border border-[#30363d] rounded p-2.5 text-xs text-white/50 font-mono cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Shield controls section */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#30363d]/40 pb-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Vigilance Protection Algorithms
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Mode selectors */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#bec7d4] uppercase">Protection Mode</label>
                  <select
                    value={protectionLevel}
                    onChange={(e) => setProtectionLevel(e.target.value)}
                    className="w-full bg-[#171c22] border border-[#30363d] focus:border-[#00a3ff] rounded p-2.5 outline-none text-xs text-white font-mono"
                  >
                    <option value="automatic">AUTOMATIC SHIELD PRE-BLOCK</option>
                    <option value="manual">MANUAL REMEDIATION PATCHING</option>
                    <option value="passive">PASSIVE INSTRUMENT TELEMETRY</option>
                  </select>
                </div>

                {/* Severity selectors */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#bec7d4] uppercase">Security Scanning Threshold</label>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="w-full bg-[#171c22] border border-[#30363d] focus:border-[#00a3ff] rounded p-2.5 outline-none text-xs text-white font-mono"
                  >
                    <option value="CRITICAL">CRITICAL ONLY (&gt; 9.0 CVSS)</option>
                    <option value="HIGH">HIGH SEVERITY (&gt; 6.0 CVSS)</option>
                    <option value="MEDIUM">MEDIUM SEVERITY (&gt; 4.0 CVSS)</option>
                    <option value="LOW">LOW SEVERITY (&gt; 1.0 CVSS)</option>
                  </select>
                </div>

              </div>

              {/* Slider for refresh frequency */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                  <span className="text-[#bec7d4]">Telemetry Auto-Sync Frequency:</span>
                  <span className="text-white font-bold">{logRefreshRate} Seconds</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={logRefreshRate}
                  onChange={(e) => setLogRefreshRate(Number(e.target.value))}
                  className="w-full h-1 bg-[#171c22] border border-[#30363d] rounded-lg appearance-none cursor-pointer accent-[#00a3ff]"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#30363d]/40 flex justify-between items-center">
              <span className="text-[10px] font-mono text-[#88919d]">
                *All variables stored securely in client-side storage
              </span>

              <button
                type="submit"
                disabled={isSaved}
                className={`px-5 py-2.5 rounded font-mono text-xs font-bold transition-all text-center flex items-center gap-2 active:scale-95 ${
                  isSaved
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-[#00a3ff] hover:brightness-110 text-black shadow"
                }`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    CONFIGS WRITTEN SUCCESSFULLY
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    SAVE ENV CONFIGS
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Side: Environment actions & simulations */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#161b22] border border-[#30363d]/50 rounded-lg p-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#ff6e63]" />
              System State Maintenance
            </h2>

            <p className="text-xs text-[#bec7d4] leading-relaxed mb-4">
              Perform deep core purges, system state restorations, or clear diagnostic metrics history. This wipes and resets the local storage database and repopulates standard nodes configurations.
            </p>

            <button
              onClick={() => {
                const conf = window.confirm("Are you sure you want to restore standard mock fleet state? This will clear customized node statuses.");
                if (conf) {
                  onResetSystemState();
                }
              }}
              className="w-full py-2.5 px-3 bg-red-500/10 hover:bg-red-500/15 text-red-400 border border-red-500/15 rounded font-mono text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              RESTORE STANDARD STATE SCHEMA
            </button>
          </div>

          <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-lg space-y-2">
            <h3 className="font-bold text-yellow-300 text-xs flex items-center gap-1.5 uppercase font-mono">
              <ShieldAlert className="w-4 h-4" />
              SOC2 Policy Guidelines
            </h3>
            <p className="text-[11px] text-yellow-200/80 leading-normal font-sans">
              Alterations to operational modes, log polling thresholds, and operator identifications are tracked inside audit parameters logs for legal compliance inspections.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
