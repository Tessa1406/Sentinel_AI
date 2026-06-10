import { useState, useEffect } from "react";
import { ConnectedNode, MotionEvent, ZoneCoverage } from "../types";
import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Wifi, 
  AlertTriangle, 
  Play, 
  CheckCircle, 
  RefreshCw,
  Search,
  Zap,
  Radio,
  Lock,
  Compass
} from "lucide-react";

interface DashboardViewProps {
  searchQuery: string;
  currentFilter: string;
  onDeployPatchOnNode: (nodeIp: string) => void;
  connectedNodes: ConnectedNode[];
  onToggleNodeStatus: (nodeId: string) => void;
  motionEvents: MotionEvent[];
  zoneCoverages: ZoneCoverage[];
  onRestartScan: () => void;
  scanProgress: number;
}

export default function DashboardView({
  searchQuery,
  currentFilter,
  onDeployPatchOnNode,
  connectedNodes,
  onToggleNodeStatus,
  motionEvents,
  zoneCoverages,
  onRestartScan,
  scanProgress
}: DashboardViewProps) {
  
  // Local active detail state
  const [selectedNode, setSelectedNode] = useState<ConnectedNode | null>(null);

  // Filter nodes based on user query
  const filteredNodes = connectedNodes.filter((node) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      node.id.toLowerCase().includes(query) || 
      node.ip.includes(query) || 
      node.metricLabel.toLowerCase().includes(query) ||
      node.status.toLowerCase().includes(query);
    
    if (!matchesSearch) return false;

    // Filter by top navbar categories
    if (currentFilter === "network") {
      return true;
    } else if (currentFilter === "threats") {
      return node.metricLabel.includes("Latency") || node.status === "OFFLINE";
    } else if (currentFilter === "assets") {
      return node.status === "ONLINE";
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Static Info line (no tech larping, just elegant and literal) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#30363d]/30 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-black font-sans text-white tracking-tight flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-[#00a3ff] animate-pulse" />
            Security Shield Command Overview
          </h1>
          <p className="text-xs font-mono text-[#bec7d4] mt-1">
            Active real-time coverage and perimeter matrix of edge nodes.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#171c22] border border-[#30363d] px-3 py-1.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e639] animate-ping" />
            <span className="text-[10px] font-mono text-[#00e639]">SECURE ONLINE</span>
          </div>

          <button
            onClick={onRestartScan}
            disabled={scanProgress > 0 && scanProgress < 100}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171c22] hover:bg-[#262a30] text-xs font-mono font-bold text-[#bec7d4] border border-[#30363d] rounded active:scale-95 disabled:opacity-50 transition-all pointer-events-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanProgress > 0 && scanProgress < 100 ? "animate-spin" : ""}`} />
            Scan Fleet
          </button>
        </div>
      </div>

      {scanProgress > 0 && scanProgress < 100 && (
        <div className="glass-panel p-4 rounded-lg relative overflow-hidden">
          <div className="scanning-line" />
          <div className="flex justify-between items-center mb-2 font-mono text-xs">
            <span className="text-[#00a3ff] flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              INTELLIGENT FLEET SCAN IN PROGRESS...
            </span>
            <span className="text-white font-bold">{scanProgress}%</span>
          </div>
          <div className="w-full bg-[#0b0e14] h-1.5 rounded-full overflow-hidden border border-[#30363d]">
            <div 
              className="bg-[#00a3ff] h-full rounded-full transition-all duration-300" 
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Fleet Shield State",
            value: "OPERATIONAL",
            sub: "Active protection active",
            icon: ShieldCheck,
            color: "text-[#00e639]",
            bgColor: "bg-[#00e639]/5",
            borderColor: "border-[#00e639]/20"
          },
          {
            title: "Vulnerabilities Identified",
            value: "2 Low-Risk",
            sub: "Remediation validated",
            icon: AlertTriangle,
            color: "text-amber-400",
            bgColor: "bg-amber-400/5",
            borderColor: "border-amber-400/20"
          },
          {
            title: "Protected Assets",
            value: "12 Edge Nodes",
            sub: `${connectedNodes.filter(n => n.status === "ONLINE").length} online & synchronized`,
            icon: Cpu,
            color: "text-[#00a3ff]",
            bgColor: "bg-[#00a3ff]/5",
            borderColor: "border-[#00a3ff]/20"
          },
          {
            title: "Compliance Index",
            value: "98.6%",
            sub: "SOC2 Compliance checked",
            icon: Activity,
            color: "text-[#98cbff]",
            bgColor: "bg-[#98cbff]/5",
            borderColor: "border-[#98cbff]/20"
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className={`p-4 rounded-lg bg-[#161b22] border ${stat.borderColor} flex justify-between items-start transition-all hover:scale-[1.01] hover:border-white/10`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#88919d] uppercase tracking-wider">{stat.title}</span>
                <h3 className={`text-xl font-black font-sans ${stat.color} tracking-tight`}>{stat.value}</h3>
                <p className="text-[10px] text-[#bec7d4]">{stat.sub}</p>
              </div>
              <div className={`p-2 rounded ${stat.bgColor} ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Core Layout: Fleet Nodes (Left) and High-tech telemetry visual (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Fleet Grid section */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#161b22] border border-[#30363d]/50 rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#00a3ff]" />
                  Edge Matrix Fleets ({filteredNodes.length} records)
                </h2>
                <p className="text-[11px] font-mono text-[#88919d] mt-1">
                  Click a device node to execute system diagnosis or change power grid settings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedNode?.id === node.id 
                    ? "bg-[#00a3ff]/5 border-[#00a3ff] glow-blue" 
                    : "bg-[#171c22] border-[#30363d] hover:border-[#88919d]/40"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-mono text-[#00a3ff] bg-[#00a3ff]/10 px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                      {node.id}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-medium ${
                      node.status === "ONLINE" ? "text-[#00e639]" : "text-[#ff6e63]"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        node.status === "ONLINE" ? "bg-[#00e639] animate-pulse" : "bg-[#ff6e63]"
                      }`} />
                      {node.status}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-white tracking-tight">{node.ip}</p>
                  
                  <div className="mt-3 pt-2 border-t border-[#30363d]/30 flex justify-between items-center">
                    <span className="text-[9px] text-[#bec7d4]">{node.metricLabel} :</span>
                    <span className="text-[10px] font-mono font-bold text-white uppercase">
                      {node.metricValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredNodes.length === 0 && (
              <div className="py-12 text-center text-xs font-mono text-[#88919d]">
                NO ACTIVE SENSOR NODES DETECTED MATCHING QUERY constraints
              </div>
            )}
          </div>

          {/* Core Logs Panel */}
          <div className="bg-[#161b22] border border-[#30363d]/50 rounded-lg p-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#ff6e63]" />
              Threat Perimeter Activity Logs
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 terminal-scroll font-mono text-[11px]">
              {motionEvents.map((event, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded border transition-all ${
                    event.type === "WARN" 
                      ? "bg-red-500/5 border-red-500/20 text-red-300" 
                      : "bg-[#171c22] border-[#30363d] text-[#bec7d4]"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-[#00a3ff]">{event.node}</span>
                    <span className="text-[9px] text-[#88919d]">{event.timestamp}</span>
                  </div>
                  <p>{event.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Node Control Center (Right panel) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#161b22] border border-[#30363d]/50 rounded-lg p-5 relative overflow-hidden">
            <div className="absolute right-2 top-2">
              <Compass className="w-20 h-20 text-[#30363d]/20 rotate-12" />
            </div>

            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5 relative">
              <Zap className="text-amber-400 w-4 h-4" />
              Sensor Control Hub
            </h2>

            {selectedNode ? (
              <div className="space-y-4 relative">
                <div className="p-3 bg-[#171c22] rounded border border-[#30363d] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-mono text-[#88919d]">DEVICE_ID:</span>
                    <span className="text-xs font-mono font-bold text-[#00a3ff]">{selectedNode.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-mono text-[#88919d]">IPV4:</span>
                    <span className="text-xs font-mono text-white">{selectedNode.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-mono text-[#88919d]">STATUS:</span>
                    <span className={`text-xs font-mono font-bold ${
                      selectedNode.status === "ONLINE" ? "text-[#00e639]" : "text-[#ff6e63]"
                    }`}>{selectedNode.status}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#bec7d4] uppercase tracking-wider">Operational Toggles:</h3>
                  <button
                    onClick={() => onToggleNodeStatus(selectedNode.id)}
                    className={`w-full py-2 px-3 rounded font-mono text-xs font-bold text-center border active:scale-95 transition-all flex items-center justify-center gap-2 ${
                      selectedNode.status === "ONLINE"
                        ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/15"
                        : "bg-[#00e639]/10 text-[#00e639] border-[#00e639]/20 hover:bg-[#00e639]/15"
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {selectedNode.status === "ONLINE" ? "SIMULATE SHUTDOWN" : "POWER BACKUP"}
                  </button>

                  <button
                    onClick={() => onDeployPatchOnNode(selectedNode.ip)}
                    className="w-full py-2 px-3 bg-[#00a3ff]/10 hover:bg-[#00a3ff]/20 text-[#00a3ff] border border-[#00a3ff]/20 rounded font-mono text-xs font-bold text-center active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    DEPLOY SECURE PATCH
                  </button>
                </div>

                <div className="p-2.5 bg-yellow-500/5 border border-yellow-500/10 rounded text-[10px] text-yellow-200/80 leading-normal">
                  ⚠️ <strong>Advisory:</strong> Triggering sandbox secure patches deploys a localized Docker runtime to test and block active buffer anomalies.
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs font-mono text-[#88919d] space-y-2">
                <p>Select an Edge device node on the left list grid to command actions.</p>
                <div className="text-[10px] border border-dashed border-[#30363d] p-3 rounded bg-[#171c22]/30 inline-block">
                  🎯 Tips: Switch with "Online" / "Offline" states on the main grid tags.
                </div>
              </div>
            )}
          </div>

          {/* Real-time Zone Coverage progress */}
          <div className="bg-[#161b22] border border-[#30363d]/50 rounded-lg p-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00e639]" />
              Encryption Zone Coverage
            </h2>
            <div className="space-y-4">
              {zoneCoverages.map((zone, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#dfe3ea]">{zone.name}</span>
                    <span className={zone.status === "ACTIVE" ? "text-[#00e639]" : "text-amber-400 font-bold"}>
                      {zone.status === "ACTIVE" ? `${zone.progress}%` : `UNSTABLE (${zone.progress}%)`}
                    </span>
                  </div>
                  <div className="w-full bg-[#171c22] h-2 rounded border border-[#30363d] overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        zone.status === "ACTIVE" ? "bg-[#00e639]" : "bg-amber-400 animate-pulse"
                      }`} 
                      style={{ width: `${zone.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
