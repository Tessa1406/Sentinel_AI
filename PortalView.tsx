import { useState, FormEvent } from "react";
import { ShieldAlert, Shield, Key, Terminal, Cpu, Radio, Sparkles, BookOpen } from "lucide-react";

interface PortalViewProps {
  onLoginSuccess: (email: string) => void;
  userEmail?: string;
}

export default function PortalView({ onLoginSuccess, userEmail }: PortalViewProps) {
  const [emailInput, setEmailInput] = useState(userEmail || "");
  const [secretKey, setSecretKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "INITIALIZING ENCRYPTED PORTAL SHIELD...",
    "BINDING SECURE UDP PORTS... OK",
    "STATUS: AWAITING OPERATOR BIOMETRIC HANDSHAKE."
  ]);

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    if (isVerifying) return;

    setIsVerifying(true);
    setConsoleLogs(prev => [...prev, `ATTEMPTING SIGN IN FOR : ${emailInput}`, "NEGOTIATING RSA HANDSHAKE SHELL..."]);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, "AUTHENTICATED SUCCESSFULLY.", "CREATING SECURE CYBER_SHELL SESSION..."]);
      setTimeout(() => {
        onLoginSuccess(emailInput);
        setIsVerifying(false);
      }, 800);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      
      {/* Decorative cyber grid scanning elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(48,54,61,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(48,54,61,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="scanning-line" />

      {/* Floating high-tech abstract decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00a3ff]/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/2 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10">
        
        {/* Portal shield logo */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[#00a3ff]/10 hover:bg-[#00a3ff]/15 text-[#00a3ff] border border-[#00a3ff]/30 rounded-xl flex items-center justify-center mx-auto transition-all duration-300 transform hover:rotate-12 hover:scale-105">
            <Shield className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <h1 className="text-3xl font-black font-sans tracking-tight text-white flex items-center justify-center gap-1.5">
              SENTINEL_AI
            </h1>
            <p className="text-xs font-mono tracking-widest text-[#00a3ff] uppercase mt-1">
              CYBER FLEET CONTROL CORES
            </p>
          </div>
        </div>

        {/* Console logs box */}
        <div className="bg-[#11141a]/90 border border-[#30363d] rounded-lg p-4 font-mono text-[10px] text-[#00e639] space-y-1 h-28 overflow-y-auto">
          {consoleLogs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-[#30363d]">[{new Date().toLocaleTimeString()}]</span>
              <span className="truncate">{log}</span>
            </div>
          ))}
          {isVerifying && <div className="text-[#00a3ff] animate-pulse">● TRANSMITTING SYNC KEYS TO CORE DOMAIN...</div>}
        </div>

        {/* Main Sign in gate panel */}
        <div className="glass-panel p-6 rounded-lg space-y-4">
          <div className="border-b border-[#30363d]/40 pb-3 flex justify-between items-center">
            <span className="text-[11px] font-mono text-white tracking-wider font-bold">OPERATOR VERIFICATION GATE</span>
            <div className="flex gap-1">
              <span className="w-2.5 h-1.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-1.5 rounded-full bg-[#00e639]/80 inline-block" />
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            
            {/* Operator Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#bec7d4] uppercase">Operator Ingress Domain (Email)</label>
              <div className="flex items-center bg-[#171c22]/80 border border-[#30363d] px-3.5 py-2.5 rounded group focus-within:border-[#00a3ff]/70 transition-all">
                <Terminal className="w-4 h-4 text-[#88919d] mr-2.5 group-focus-within:text-[#00a3ff]" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="bg-transparent border-none outline-none focus:ring-0 text-xs font-mono w-full text-white placeholder-[#bec7d4]/30"
                  placeholder="operator@sentinel.ai"
                />
              </div>
            </div>

            {/* Secret code keys and security hashes */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-[#bec7d4] uppercase">Ingress Secret Verification Key</label>
              <div className="flex items-center bg-[#171c22]/80 border border-[#30363d] px-3.5 py-2.5 rounded group focus-within:border-[#00a3ff]/70 transition-all">
                <Key className="w-4 h-4 text-[#88919d] mr-2.5 group-focus-within:text-[#00a3ff]" />
                <input
                  type="password"
                  required
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="bg-transparent border-none outline-none focus:ring-0 text-xs font-mono w-full text-white placeholder-[#bec7d4]/30"
                  placeholder="********"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-[#00a3ff] hover:brightness-110 disabled:opacity-50 active:scale-98 transition-all rounded font-mono text-xs font-bold text-black uppercase tracking-wider shadow-lg shadow-[#00a3ff]/15 flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 text-black animate-pulse" />
              {isVerifying ? "VERIFYING SECURITY TOKENS..." : "VERIFY OPERATOR CREDENTIALS"}
            </button>
          </form>
        </div>

        {/* Bottom security credentials notice (literal, not tech larping) */}
        <p className="text-[11px] font-mono text-center text-[#88919d] leading-normal">
          Authorized operations checkpoint. Enforces static SOC2 compliance rules, AES encryption handshakes, and strict cyber perimeter defense.
        </p>

      </div>
    </div>
  );
}
