import { 
  Bell, 
  Terminal, 
  Settings, 
  Search, 
  Cpu, 
  Zap, 
  LogOut 
} from "lucide-react";

interface TopNavBarProps {
  currentFilter: string; // 'network' | 'threats' | 'assets'
  setCurrentFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onDeployPatch: () => void;
  onSystemPulse: () => void;
  userEmail?: string;
  onLogout?: () => void;
}

export default function TopNavBar({
  currentFilter,
  setCurrentFilter,
  searchQuery,
  setSearchQuery,
  onDeployPatch,
  onSystemPulse,
  userEmail,
  onLogout
}: TopNavBarProps) {
  return (
    <header className="flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40 bg-[#0f1419]/90 backdrop-blur-xl border-b border-[#30363d]/30">
      
      {/* Brand title & sub-filters */}
      <div className="flex items-center gap-12">
        <span className="font-sans text-xl font-black tracking-tighter text-[#98cbff] cursor-pointer hover:opacity-90">
          SENTINEL_AI
        </span>
        
        <nav className="hidden md:flex gap-6 h-full items-center">
          {[
            { id: "network", label: "Network" },
            { id: "threats", label: "Threats" },
            { id: "assets", label: "Assets" }
          ].map((nav) => {
            const isActive = currentFilter === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setCurrentFilter(nav.id)}
                className={`font-mono text-xs pb-1 transition-all border-b-2 font-medium tracking-wide ${
                  isActive
                    ? "text-[#00a3ff] border-[#00a3ff]"
                    : "text-[#bec7d4] border-transparent hover:text-white"
                }`}
              >
                {nav.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Center Search Input & Pulse Actions */}
      <div className="flex items-center gap-6">
        
        {/* Decorative DB query container */}
        <div className="hidden lg:flex items-center bg-[#171c22]/50 border border-[#30363d] px-3 py-1.5 rounded w-64 group focus-within:border-[#00a3ff]/70 transition-all">
          <Terminal className="w-3.5 h-3.5 text-[#88919d] mr-2 group-focus-within:text-[#00a3ff]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-[11px] font-mono w-full text-white placeholder-[#bec7d4]/40"
            placeholder="Search / QUERY_DB..."
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="text-xs text-[#88919d] hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          <button 
            title="System Command Terminal"
            onClick={onSystemPulse}
            className="p-2 rounded text-[#bec7d4] hover:text-[#00a3ff] hover:bg-[#1b2026] relative transition-colors group"
          >
            <Terminal className="w-4.5 h-4.5" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#161b22] border border-[#30363d] text-[9px] font-mono px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Run Pulse Diagnostic
            </span>
          </button>
          
          <button 
            title="Operational Alerts"
            className="p-2 rounded text-[#bec7d4] hover:text-red-400 hover:bg-[#1b2026] relative transition-colors"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-[#30363d]/50 hidden sm:block mx-1"></div>

        {/* Global Hub Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSystemPulse}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171c22] hover:bg-[#262a30] text-[#00a3ff] border border-[#30363d]/80 text-[10px] uppercase font-bold tracking-wider font-mono active:scale-95 transition-all text-center"
          >
            <Cpu className="w-3.5 h-3.5" />
            System Pulse
          </button>
          
          <button
            onClick={onDeployPatch}
            className="inline-flex items-center gap-1.5 px-4.5 py-1.5 bg-[#00a3ff] hover:brightness-110 active:scale-95 text-black text-[10px] uppercase font-bold tracking-wider font-mono shadow-md shadow-[#00a3ff]/20 transition-all text-center"
          >
            <Zap className="w-3.5 h-3.5 animate-[pulse_1.5s_infinite]" />
            Deploy Patch
          </button>
        </div>

        {/* User Identity Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#30363d]/50">
          <div className="relative group/avatar cursor-pointer">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#00a3ff]/30 hover:border-[#00a3ff] transition-all bg-sky-950 flex items-center justify-center">
              {userEmail ? (
                <span className="text-white text-xs font-bold uppercase font-mono">
                  {userEmail.substring(0, 2)}
                </span>
              ) : (
                <span className="text-white text-xs font-bold font-mono">OP</span>
              )}
            </div>
            {/* Hover details cards */}
            <div className="absolute right-0 top-10 bg-[#161b22] border border-[#30363d] p-3 rounded shadow-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none z-50 min-w-[200px]">
              <p className="text-[10px] font-mono text-[#88919d] uppercase">Authorized Operator</p>
              <p className="text-xs font-sans text-white font-medium truncate">{userEmail || "root_admin@sentinel.ai"}</p>
              <p className="text-[9px] font-mono text-[#00e639] mt-1.5 uppercase">Security Tier: LEVEL_0</p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
