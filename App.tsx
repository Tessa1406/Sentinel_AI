import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  ConnectedNode, 
  MotionEvent, 
  ZoneCoverage, 
  ActiveAlert, 
  ChatMessage 
} from "./types";

import SideNavBar from "./components/SideNavBar";
import TopNavBar from "./components/TopNavBar";
import PortalView from "./components/PortalView";
import DashboardView from "./components/DashboardView";
import ThreatsView from "./components/ThreatsView";
import LogsView from "./components/LogsView";
import AssistantView from "./components/AssistantView";
import SettingsView from "./components/SettingsView";

import { 
  ShieldAlert, 
  X, 
  AlertOctagon, 
  Sparkles, 
  CheckCircle, 
  Zap, 
  Terminal,
  RefreshCw,
  Bell
} from "lucide-react";

export default function App() {
  
  // Login Gate State (Session persistence using client localStorage)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("sentinel_is_logged_in") === "true";
  });
  
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("sentinel_user_email") || "";
  });

  // Global Operations State
  const [activeTab, setActiveTab] = useState("assistant");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("network"); // 'network' | 'threats' | 'assets'
  const [isLockdownActive, setIsLockdownActive] = useState(false);
  const [globalBannerNotification, setGlobalBannerNotification] = useState<string | null>(null);
  
  // Interactive Fleet Scan progress state
  const [scanProgress, setScanProgress] = useState(0);

  // Stateful Data sets with LocalStorage state caching
  const [connectedNodes, setConnectedNodes] = useState<ConnectedNode[]>(() => {
    const cached = localStorage.getItem("sentinel_nodes");
    if (cached) return JSON.parse(cached);
    return [
      { id: "NODE_ALPHA", ip: "10.0.8.1", status: "ONLINE", lastSeen: "2 mins ago", metricLabel: "Latency", metricValue: "24 ms" },
      { id: "NODE_BETA", ip: "10.0.8.2", status: "ONLINE", lastSeen: "Just now", metricLabel: "Memory CPU", metricValue: "42% CPU" },
      { id: "NODE_GAMMA", ip: "10.0.8.3", status: "ONLINE", lastSeen: "1 min ago", metricLabel: "Ingress Flow", metricValue: "4.2 GB/s" },
      { id: "NODE_DELTA", ip: "10.0.8.4", status: "ONLINE", lastSeen: "Just now", metricLabel: "Ping Range", metricValue: "12 ms" },
      { id: "NODE_EPSILON", ip: "10.0.8.5", status: "ONLINE", lastSeen: "5 mins ago", metricLabel: "SSL Grade", metricValue: "TLS 1.3" },
      { id: "NODE_ZETA", ip: "10.0.8.6", status: "ONLINE", lastSeen: "Just now", metricLabel: "Firewall Profile", metricValue: "RULES_OK" },
      { id: "NODE_ETA", ip: "10.0.8.7", status: "ONLINE", lastSeen: "12 mins ago", metricLabel: "Latency", metricValue: "115 ms" },
      { id: "NODE_THETA", ip: "10.0.8.8", status: "ONLINE", lastSeen: "Just now", metricLabel: "Memory CPU", metricValue: "18% CPU" },
      { id: "NODE_IOTA", ip: "10.0.8.9", status: "ONLINE", lastSeen: "3 mins ago", metricLabel: "Ingress Flow", metricValue: "1.2 GB/s" },
      { id: "NODE_KAPPA", ip: "10.0.8.10", status: "ONLINE", lastSeen: "Just now", metricLabel: "Ping Range", metricValue: "8 ms" },
      { id: "NODE_LAMBDA", ip: "10.0.8.11", status: "OFFLINE", lastSeen: "3 hours ago", metricLabel: "SSL Grade", metricValue: "EXPIRED" },
      { id: "NODE_MU", ip: "10.0.8.12", status: "ONLINE", lastSeen: "Just now", metricLabel: "Firewall Profile", metricValue: "RULES_OK" },
    ];
  });

  const [motionEvents, setMotionEvents] = useState<MotionEvent[]>(() => {
    const cached = localStorage.getItem("sentinel_events");
    if (cached) return JSON.parse(cached);
    return [
      { timestamp: "12:00:15", type: "INFO", node: "NODE_ALPHA", message: "Dynamic health heartbeat check successful" },
      { timestamp: "11:58:32", type: "WARN", node: "NODE_LAMBDA", message: "Anomalous handshake dropout detected. Offline state initialized" },
      { timestamp: "11:55:04", type: "INFO", node: "NODE_BETA", message: "Encrypted sandbox runtime container mounted" },
      { timestamp: "11:43:52", type: "WARN", node: "NODE_ETA", message: "Latency exceeded hazard parameter boundaries (115ms)" },
    ];
  });

  const [zoneCoverages, setZoneCoverages] = useState<ZoneCoverage[]>(() => {
    const cached = localStorage.getItem("sentinel_zones");
    if (cached) return JSON.parse(cached);
    return [
      { name: "Perimeter Shield Area", status: "ACTIVE", progress: 100 },
      { name: "Raw Ingress Gateway Block", status: "ACTIVE", progress: 100 },
      { name: "Docker Sandbox Buffer Nodes", status: "UNSTABLE", progress: 78 },
    ];
  });

  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>(() => {
    const cached = localStorage.getItem("sentinel_alerts");
    if (cached) return JSON.parse(cached);
    return [
      { source: "CWE-89 SQL INJECTION DETECTED", status: "Unresolved Vulnerability Threat", time: "11:58", severity: "CRITICAL", details: "Improper inputs sanitizer intercepted in Authenticate User Endpoint API route.", remediation: "Apply parameterized node queries or refactor with strict SQL statements.", rawLog: "POST /api/v1/auth - Query: SELECT * FROM users WHERE user = 'admin' OR '1'='1'..." },
      { source: "CVE-2023-4412 UNSAFE CORS", status: "Improper Allowed Origin Wildcard", time: "11:42", severity: "HIGH", details: "Permissive headers detected risking third-party authentication theft.", remediation: "Define origin allow list array indices on Express application middleware layer.", rawLog: "Access-Control-Allow-Origin: *" },
      { source: "NODE SHUTDOWN ALERT", status: "Uplink Failure", time: "11:20", severity: "MEDIUM", details: "Node Lambda (10.0.8.11) dropped offline. No heartbeat detected." }
    ];
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const cached = localStorage.getItem("sentinel_chats");
    if (cached) return JSON.parse(cached);
    return [
      { id: "welcome", sender: "SENTINEL_AI", timestamp: "12:00", text: "### Greetings, Secure Core Operator\n\nI am **SENTINEL_AI**, your autonomous security command co-pilot. I have ran initial scans across all **12 Edge Nodes** on our fleet mesh grid.\n\n*Current status matrix:* \n- **11 nodes** showing secure online.\n- **1 critical SQL injection hazard** flagged inside our active codebase.\n\nType in your query below, or click any of the **Diagnostic Macros** on the left console to debug vulnerabilities, generate secure code refactors, or write certified SOC2 remediation policies." }
    ];
  });

  // State Caching side effects
  useEffect(() => {
    localStorage.setItem("sentinel_nodes", JSON.stringify(connectedNodes));
  }, [connectedNodes]);

  useEffect(() => {
    localStorage.setItem("sentinel_events", JSON.stringify(motionEvents));
  }, [motionEvents]);

  useEffect(() => {
    localStorage.setItem("sentinel_zones", JSON.stringify(zoneCoverages));
  }, [zoneCoverages]);

  useEffect(() => {
    localStorage.setItem("sentinel_alerts", JSON.stringify(activeAlerts));
  }, [activeAlerts]);

  useEffect(() => {
    localStorage.setItem("sentinel_chats", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Login Handlers
  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    localStorage.setItem("sentinel_is_logged_in", "true");
    localStorage.setItem("sentinel_user_email", email);
    triggerBannerNotification("🔐 CORE AUTHORIZATION HANDSHAKE: GRANTED");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("sentinel_is_logged_in", "false");
    triggerBannerNotification("🔓 PORTAL LOCKED. DISCONNECTED FROM MESH GRID");
  };

  const handleUpdateOperatorEmail = (email: string) => {
    setUserEmail(email);
    localStorage.setItem("sentinel_user_email", email);
    triggerBannerNotification("✏️ OPERATOR EMAIL COMPILATION UPDATE: COMPLETED");
  };

  // Helper trigger banner function
  const triggerBannerNotification = (message: string) => {
    setGlobalBannerNotification(message);
    setTimeout(() => {
      setGlobalBannerNotification(null);
    }, 4500);
  };

  // Node operations triggered from Dashboard View
  const handleToggleNodeStatus = (nodeId: string) => {
    const targetNode = connectedNodes.find(n => n.id === nodeId);
    if (!targetNode) return;

    const newStatus = targetNode.status === "ONLINE" ? "OFFLINE" : "ONLINE";
    const newMetric = targetNode.status === "ONLINE" ? "MEM_ERROR" : "24 ms";
    
    setConnectedNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          status: newStatus,
          lastSeen: "Just now",
          metricValue: newStatus === "ONLINE" ? "Rules Synchronized" : "OFFLINE UNSTABLE"
        };
      }
      return node;
    }));

    // Append warn log trace
    const time = new Date().toLocaleTimeString();
    const eventMsg: MotionEvent = {
      timestamp: time,
      type: newStatus === "ONLINE" ? "INFO" : "WARN",
      node: nodeId,
      message: `Heartbeat state toggle command completed: device is now ${newStatus}`
    };
    setMotionEvents(prev => [eventMsg, ...prev]);

    // Handle offline status notification & trigger alert additions
    if (newStatus === "OFFLINE") {
      const newAlert: ActiveAlert = {
        source: `${nodeId} HEARTBEAT ERROR`,
        status: "Node telemetry dropped offline",
        time: "Just now",
        severity: "HIGH",
        details: "Critical interface dropped response on secure mesh UDP ports matrix."
      };
      setActiveAlerts(prev => [newAlert, ...prev]);
    } else {
      // Clear alert
      setActiveAlerts(prev => prev.filter(a => !a.source.startsWith(nodeId)));
    }

    triggerBannerNotification(`🔌 DEVICE STATE CHANGE: ${nodeId} TO ${newStatus}`);
  };

  const handleDeployPatchOnNode = (nodeIp: string) => {
    triggerBannerNotification(`⚡ CONSTRUCTING ENCRYPTED DOCKER FORWARD PATCH AT ${nodeIp}`);
    
    setTimeout(() => {
      // Update zone coverages to active
      setZoneCoverages(prev => prev.map(z => {
        if (z.name.includes("Docker")) {
          return { ...z, status: "ACTIVE", progress: 100 };
        }
        return z;
      }));
      triggerBannerNotification(`🕊️ PATCH SUCCESSFULLY INTEGRATED AND VERIFIED SECURE AT INGRESS_KEY`);
    }, 1200);
  };

  // Full manual deployment patch (Global TopNavBar action)
  const handleGlobalDeployPatch = () => {
    triggerBannerNotification("🛠️ INJECTING GLOBAL SECURE CODES POLICIES...");
    
    setTimeout(() => {
      // Set all vulnerable elements patched and safe
      setZoneCoverages(prev => prev.map(z => ({ ...z, status: "ACTIVE", progress: 100 })));
      
      // Update alerts
      setActiveAlerts(prev => prev.map(a => ({
        ...a,
        remediation: "Remediated globally with code patches",
        severity: "LOW" as const
      })));

      // Add Model AI chat logs confirmation
      const time = new Date().toLocaleTimeString();
      const patchChatMessage: ChatMessage = {
        id: "sys_" + Date.now(),
        sender: "SENTINEL_AI",
        timestamp: time,
        text: "### SYSTEM LEVEL_0 SECURE REFACTOR COMPLETED\n\n- Parameter bindings globally validated across DB authenticate routes.\n- Wildcard CORS rules restricted safely to specific domain indexes.\n- Buffer limits checked securely.\n\nAll CVE alert severities downgraded successfully to low operational priority indices."
      };
      setChatHistory(prev => [...prev, patchChatMessage]);
      setActiveTab("assistant");

      triggerBannerNotification("🛡️ GLOBAL MESH REFLECTS SECURED SOC2 CORELINES");
    }, 1500);
  };

  // Interactive pulse trace
  const handleSystemPulseTrace = () => {
    setScanProgress(1);
    triggerBannerNotification("⚙️ COMMENCING HIGH-FIDELITY ACTIVE PORT AND CERTIFICATE TRACE");
    
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          triggerBannerNotification("✅ COMPLETE FLEET COMMAND SCAN: ALL SECURE CONTEXT VALIDATED");
          return 0;
        }
        return p + 13;
      });
    }, 100);
  };

  // Interactive AI trigger from Threats code block
  const handleThreatAskAI = (prompt: string) => {
    setActiveTab("assistant");
    // Trigger prompt directly in AssistantView
    triggerBannerNotification("🛰️ LAUNCHING CYBER DEFENSE AI CONSULTATION...");
  };

  // System State Maintenance Resets
  const handleResetSystemState = () => {
    localStorage.removeItem("sentinel_nodes");
    localStorage.removeItem("sentinel_events");
    localStorage.removeItem("sentinel_zones");
    localStorage.removeItem("sentinel_alerts");
    localStorage.removeItem("sentinel_chats");
    
    // Hard refresh window to load initial datasets
    window.location.reload();
  };

  // Render proper child views matching the active sidebar tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            searchQuery={searchQuery}
            currentFilter={currentFilter}
            onDeployPatchOnNode={handleDeployPatchOnNode}
            connectedNodes={connectedNodes}
            onToggleNodeStatus={handleToggleNodeStatus}
            motionEvents={motionEvents}
            zoneCoverages={zoneCoverages}
            onRestartScan={handleSystemPulseTrace}
            scanProgress={scanProgress}
          />
        );
      case "endpoints":
      case "malware":
      case "compliance":
      case "threats":
        return (
          <ThreatsView 
            onDeployPatch={handleGlobalDeployPatch}
            onAskAI={handleThreatAskAI}
          />
        );
      case "logs":
        return (
          <LogsView
            alerts={activeAlerts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClearLogs={() => {
              setActiveAlerts([]);
              triggerBannerNotification("🗑️ ALERT SEVERITY DATABASE SCRUBBED CLEAN");
            }}
          />
        );
      case "assistant":
        return (
          <AssistantView
            onDeployPatch={handleGlobalDeployPatch}
            chatHistory={chatHistory}
            onAddChatMessage={(msg) => setChatHistory(prev => [...prev, msg])}
            onClearChatHistory={() => {
              setChatHistory([
                { id: "welcome", sender: "SENTINEL_AI", timestamp: "12:00", text: "### Greetings, Secure Core Operator\n\nSentinel Security AI terminal has restarted." }
              ]);
              triggerBannerNotification("🧹 CHAT BUFFER DELETED");
            }}
          />
        );
      case "settings":
        return (
          <SettingsView
            userEmail={userEmail}
            onUpdateOperatorEmail={handleUpdateOperatorEmail}
            onResetSystemState={handleResetSystemState}
          />
        );
      case "docs":
        return (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <h1 className="text-2xl font-black font-sans text-white border-b border-[#30363d]/30 pb-4">
              🛡️ CYBER_SHELL Security Core Operations Handbook
            </h1>
            <div className="bg-[#161b22] border border-[#30363d]/50 p-6 rounded-lg space-y-4 text-xs leading-relaxed text-[#bec7d4]">
              <h2 className="text-sm font-bold text-white uppercase font-mono text-[#00a3ff]">Manual Ingress & Verification Guide:</h2>
              <p>
                Each system node in the mesh network functions as an active telemetry collector. If a node suffers raw frame drops (like Node Lambda), its encryption keys decay and require verification.
              </p>
              
              <h2 className="text-sm font-bold text-white uppercase font-mono text-[#00e639]">Remediating Vulnerabilities:</h2>
              <p>
                Operators can locate identified CWE weaknesses (like improper authentication checks) inside the <strong>Vulnerability Perimeter Scanner</strong> (End Point Security / Malware tab), verify the source traces, and apply structural refactoring patches instantly.
              </p>

              <h2 className="text-sm font-bold text-white uppercase font-mono text-red-400">Rules of Ingress Engagement:</h2>
              <p>
                Conduct automated pulse checks routinely to map port allocations. Standard operations enforce strict compliance logs recorded for auditing verification inspectors.
              </p>
            </div>
          </div>
        );
      case "support":
        return (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <h1 className="text-2xl font-black font-sans text-white border-b border-[#30363d]/30 pb-4">
              🛰️ System Operational Support Matrix
            </h1>
            <div className="bg-[#161b22] border border-[#30363d]/50 p-6 rounded-lg space-y-4 text-xs leading-relaxed text-[#bec7d4]">
              <p className="text-sm text-white font-sans">
                Having issues synchronized with node frameworks or deploying containerized safe blocks? Reach out directly via localized secure comms parameters.
              </p>
              
              <div className="p-4 bg-[#171c22] border border-[#30363d] rounded font-mono text-[11px] text-white space-y-1.5">
                <p>🛰️ SECURE CH uplink : https://channels.sentinel.ai/grid</p>
                <p>🔑 ACTIVE VERIFICATION KEY : {userEmail}</p>
                <p>📊 COMPREHENSIVE COMPLIANCE INDEX : 98.6% SOC2 APPROVED</p>
              </div>
            </div>
          </div>
        );
      default:
        // Default back to dashboard
        setActiveTab("dashboard");
        return null;
    }
  };

  // If the user has not verified operator codes yet, render the gorgeous Verification Gate first!
  if (!isLoggedIn) {
    return <PortalView onLoginSuccess={handleLoginSuccess} userEmail={userEmail} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#dfe3ea] font-sans flex relative overflow-hidden">
      
      {/* Decorative scanning line animation */}
      <div className="scanning-line" />

      {/* Extreme Lockdown Warning Screener Overlays */}
      <AnimatePresence>
        {isLockdownActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-950/95 backdrop-blur-md z-50 flex flex-col justify-center items-center p-6 text-center select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="max-w-xl bg-black border-2 border-red-500 rounded-xl p-8 space-y-6 shadow-2xl shadow-red-500/20 glow-red"
            >
              <AlertOctagon className="w-20 h-20 text-red-500 mx-auto animate-bounce" />
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black font-sans text-red-500 uppercase tracking-tight">
                  CRITICAL LOCKDOWN ENFORCED
                </h2>
                <p className="text-xs font-mono text-red-200">
                  ALL NETWORK COREROUTING DE-AUTHED PERMANENTLY. MESH GRID SHUTDOWN.
                </p>
              </div>

              <div className="bg-red-500/5 p-4 rounded border border-red-500/30 text-xs font-mono text-red-200/80 leading-normal">
                WARNING: Immediate manual physical key overrides are required to reinstate operational statuses. Unauthorized attempts to bypass will alert federal inspection arrays.
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setIsLockdownActive(false)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-black uppercase tracking-wider rounded transition-all active:scale-95"
                >
                  DE-AUTHORIZE LOCKDOWN STATUS
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating active global banner notifications */}
      <AnimatePresence>
        {globalBannerNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 xs:w-96 md:w-[480px] z-50"
          >
            <div className="p-3.5 bg-[#161b22] border border-[#00a3ff] rounded-lg shadow-2xl flex items-center justify-between gap-3 relative overflow-hidden">
              <div className="absolute left-0 bottom-0 top-0 w-1 bg-[#00a3ff]" />
              
              <div className="flex items-center gap-3 pl-2">
                <div className="w-8 h-8 rounded bg-[#00a3ff]/10 text-[#00a3ff] flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#88919d] uppercase">Sentinel Command: Notification</span>
                  <p className="text-xs font-mono text-white leading-normal font-bold">
                    {globalBannerNotification}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setGlobalBannerNotification(null)}
                className="text-[#88919d] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Navigation panel Rail */}
      <SideNavBar
        activeTab={activeTab === "endpoints" || activeTab === "malware" || activeTab === "compliance" ? "endpoints" : activeTab}
        setActiveTab={(tab) => {
          // Normalise threat screens
          if (tab === "endpoints") {
            setActiveTab("threats");
          } else {
            setActiveTab(tab);
          }
        }}
        onLockdownToggle={() => {
          setIsLockdownActive(true);
          triggerBannerNotification("🔴 CONGESTING COREROUTE BINDINGS: LOCKDOWN OVERRIDE ENGAGED");
        }}
        isLockdownActive={isLockdownActive}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />

      {/* Central Application Workspace Area */}
      <div className="flex-1 flex flex-col pl-64 min-h-screen">
        
        {/* Top Header Rail */}
        <TopNavBar
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onDeployPatch={handleGlobalDeployPatch}
          onSystemPulse={handleSystemPulseTrace}
          userEmail={userEmail}
          onLogout={handleLogout}
        />

        {/* Dynamic Nav View Renderer */}
        <main className="flex-1 p-6 relative overflow-y-auto">
          {renderTabContent()}
        </main>

      </div>

    </div>
  );
}
