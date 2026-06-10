import { 
  LayoutDashboard, 
  Activity, 
  Shield, 
  Bug, 
  FileCheck, 
  Terminal, 
  Settings, 
  BookOpen, 
  LifeBuoy, 
  Bot, 
  Lock,
  Unlock,
  AlertTriangle
} from "lucide-react";

interface SideNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLockdownToggle: () => void;
  isLockdownActive: boolean;
  onLogout?: () => void;
  isLoggedIn?: boolean;
}

export default function SideNavBar({
  activeTab,
  setActiveTab,
  onLockdownToggle,
  isLockdownActive,
  onLogout,
  isLoggedIn
}: SideNavBarProps) {
  const mainNavItems = [
    { id: "assistant", label: "AI Assistant", icon: Bot },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "traffic", label: "Traffic Analysis", icon: Activity },
    { id: "endpoints", label: "End Point Security", icon: Shield },
    { id: "malware", label: "Malware Lab", icon: Bug },
    { id: "compliance", label: "Compliance", icon: FileCheck },
    { id: "logs", label: "Logs", icon: Terminal },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col bg-[#171c22] border-r border-[#30363d]/50 py-4 overflow-y-auto z-40">
      {/* Brand Logo Header */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
          isLockdownActive ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
        }`}>
          <Shield className={`w-5 h-5 ${isLockdownActive ? "animate-[bounce_2s_infinite]" : ""}`} />
        </div>
        <div>
          <h2 className="font-sans text-lg font-black tracking-tight text-white flex items-center gap-1">
            CYBER_SHELL
          </h2>
          <p className="font-mono text-[9px] uppercase tracking-widest text-[#00a3ff]">
            Vigilance Active
          </p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 space-y-1 px-2">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 font-mono text-xs text-left transition-all rounded-md group ${
                isActive
                  ? "bg-[#00a3ff]/10 text-[#00a3ff] border-l-4 border-[#00a3ff] translate-x-1"
                  : "text-[#bec7d4] hover:bg-[#1b2026] hover:text-[#dfe3ea]"
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${
                isActive ? "text-[#00a3ff]" : "text-[#88919d] group-hover:text-sky-400"
              }`} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Bottom Actions Area */}
      <div className="px-4 mt-auto pt-4 space-y-4">
        {/* System Settings (Highlights only when setting is selected) */}
        <button
          onClick={() => setActiveTab("settings")}
          className={`w-full flex items-center gap-3 px-4 py-3 font-mono text-xs text-left transition-all rounded-md group ${
            activeTab === "settings"
              ? "bg-[#00a3ff]/10 text-[#00a3ff] border-l-4 border-[#00a3ff] translate-x-1"
              : "text-[#bec7d4] hover:bg-[#1b2026] hover:text-[#dfe3ea]"
          }`}
        >
          <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-[#00a3ff]" : "text-[#88919d]"}`} />
          System Settings
        </button>

        {isLoggedIn && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 font-mono text-xs text-left text-orange-400/80 hover:text-orange-400 hover:bg-orange-500/5 transition-all rounded-md"
          >
            <Unlock className="w-4 h-4" />
            Lock Portal
          </button>
        )}

        <button
          onClick={onLockdownToggle}
          className={`w-full py-3 rounded font-mono text-[11px] font-bold border uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            isLockdownActive
              ? "bg-red-500/10 text-red-400 border-red-500/40 glow-red animate-[pulse_1.5s_infinite]"
              : "bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-500/30 hover:border-red-500/60"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          {isLockdownActive ? "LOCKDOWN ACTIVE" : "EMERGENCY LOCKDOWN"}
        </button>

        <div className="border-t border-[#30363d]/30 pt-3 flex justify-around">
          <a
            href="#docs"
            onClick={(e) => { e.preventDefault(); setActiveTab("docs"); }}
            className="text-[#bec7d4] hover:text-[#00a3ff] py-1 text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Docs
          </a>
          <a
            href="#support"
            onClick={(e) => { e.preventDefault(); setActiveTab("support"); }}
            className="text-[#bec7d4] hover:text-[#00a3ff] py-1 text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            Support
          </a>
        </div>
      </div>
    </aside>
  );
}
