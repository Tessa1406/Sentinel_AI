import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { 
  Bot, 
  Send, 
  ShieldAlert, 
  RefreshCw, 
  Sparkles, 
  Trash2, 
  CheckCircle,
  Code2,
  Lock
} from "lucide-react";

interface AssistantViewProps {
  onDeployPatch: () => void;
  chatHistory: ChatMessage[];
  onAddChatMessage: (msg: ChatMessage) => void;
  onClearChatHistory: () => void;
}

export default function AssistantView({
  onDeployPatch,
  chatHistory,
  onAddChatMessage,
  onClearChatHistory
}: AssistantViewProps) {
  
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Quick prompt suggestions
  const suggestions = [
    { label: "Audit Endpoints", prompt: "AUDIT ENDPOINTS" },
    { label: "Explain SQLi Vulnerability", prompt: "EXPLAIN SQLi" },
    { label: "Review Threat Log Code", prompt: "REVIEW CODE" },
    { label: "Recent System CVEs", prompt: "RECENT CVEs" }
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  // Handle server-side proxy query to Gemini
  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = (customPrompt || inputText).trim();
    if (!promptToSend || isLoading) return;

    // Add user message to history
    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      sender: "OPERATOR",
      timestamp: new Date().toLocaleTimeString(),
      text: promptToSend
    };
    onAddChatMessage(userMsg);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send history together with current prompt for full multi-turn assistant capabilities
        body: JSON.stringify({
          message: promptToSend,
          history: chatHistory.map(h => ({
            role: h.sender === "OPERATOR" ? "user" : "model",
            text: h.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result = await response.json();
      
      const aiMsg: ChatMessage = {
        id: "ai_" + Date.now(),
        sender: "SENTINEL_AI",
        timestamp: new Date().toLocaleTimeString(),
        text: result.text || "No response received."
      };
      onAddChatMessage(aiMsg);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: "ai_" + Date.now(),
        sender: "SENTINEL_AI",
        timestamp: new Date().toLocaleTimeString(),
        text: `⚡ **CRITICAL ERROR**: Communication uplink severed.\n\nCould not query the Sentinel Security Core on server side. Please ensure your Express routing is configured correctly. \n\n*Technical info:* \n\`\`\`javascript\nError: ${err.message || err}\n\`\`\``
      };
      onAddChatMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Beautiful render helper that converts basic Markdown structures into React JSX
  // Deals with headings (###), bullet points (*), bold (**), and Code blocks (```)
  const renderFormattedMarkdown = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        // Code Block
        const lines = part.split("\n");
        const headerLine = lines[0].replace("```", "").trim();
        const codeText = lines.slice(1, -1).join("\n");

        return (
          <div key={index} className="my-3 border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117] font-mono text-[11px] text-emerald-400">
            <div className="bg-[#161b22] px-4 py-1.5 border-b border-[#30363d] flex justify-between items-center text-[10px] text-[#88919d]">
              <span>{headerLine || "REMEDIATION_CODE"}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(codeText);
                  // Highlight button or similar
                }}
                className="hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                Copy Code
              </button>
            </div>
            <pre className="p-4 overflow-x-auto leading-relaxed">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }

      // Format simple markdown tokens line-by-line
      const lines = part.split("\n");
      return (
        <div key={index} className="space-y-1.5 leading-relaxed text-xs">
          {lines.map((line, lineIdx) => {
            let processedLine = line;

            // Heading ###
            if (processedLine.startsWith("###")) {
              return (
                <h3 key={lineIdx} className="text-sm font-black font-sans text-[#9cceff] tracking-tight uppercase mt-3 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#00a3ff]" />
                  {processedLine.replace("###", "").trim()}
                </h3>
              );
            }
            // Heading ####
            if (processedLine.startsWith("####")) {
              return (
                <h4 key={lineIdx} className="text-xs font-bold font-mono text-[#00e639] uppercase tracking-wider mt-2">
                  {processedLine.replace("####", "").trim()}
                </h4>
              );
            }

            // List item *
            if (processedLine.trim().startsWith("*") || processedLine.trim().startsWith("-")) {
              const cleaned = processedLine.trim().substring(1).trim();
              return (
                <li key={lineIdx} className="list-none pl-4 relative text-[#bec7d4] text-[11px] my-1">
                  <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-[#00a3ff]" />
                  {cleaned}
                </li>
              );
            }

            // Bold styling matcher
            const boldParts = processedLine.split(/(\*\*.*?\*\*)/g);
            return (
              <p key={lineIdx} className="text-[#dfe3ea] min-h-[1rem]">
                {boldParts.map((boldPart, bpIdx) => {
                  if (boldPart.startsWith("**") && boldPart.endsWith("**")) {
                    return (
                      <strong key={bpIdx} className="text-white font-bold bg-[#30363d]/30 px-1 rounded mx-0.5">
                        {boldPart.slice(2, -2)}
                      </strong>
                    );
                  }
                  return boldPart;
                })}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#30363d]/30 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-black font-sans text-white tracking-tight flex items-center gap-2">
            <Bot className="w-7 h-7 text-[#00a3ff] animate-[pulse_2s_infinite]" />
            Sentinel Autonomous AI Defense
          </h1>
          <p className="text-xs font-mono text-[#bec7d4] mt-1">
            Real-time advisory system powered by Gemini 3.5 Flash for static threat defense.
          </p>
        </div>

        <button
          onClick={onClearChatHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/10 hover:bg-red-950/30 text-xs font-mono font-bold text-red-400 border border-red-500/10 rounded active:scale-95 transition-all text-center"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Chat Cache
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[520px]">
        
        {/* Left Suggestions & Context Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-[#161b22] border border-[#30363d]/50 p-5 rounded-lg">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#88919d] uppercase tracking-wider">Operational Mode</span>
              <h3 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e639] animate-pulse" />
                Vigilance Active (Cores Sync)
              </h3>
            </div>

            <div className="p-3 bg-[#171c22] border border-[#30363d] rounded text-[11px] text-[#bec7d4] leading-relaxed">
              💬 <strong>Pro-Tip:</strong> Tap one of the speed diagnostics prompts below to immediately query static threat remediations.
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#88919d] uppercase">Diagnostic Macros:</span>
              <div className="grid grid-cols-1 gap-1.5">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug.prompt)}
                    disabled={isLoading}
                    className="p-2.5 bg-[#171c22]/50 hover:bg-sky-500/5 hover:text-[#00a3ff] border border-[#30363d] hover:border-[#00a3ff]/30 rounded text-left font-mono text-[10px] text-white transition-all overflow-hidden text-ellipsis whitespace-nowrap active:scale-98"
                  >
                    🚀 {sug.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#30363d]/30 text-[10px] font-mono text-[#88919d] space-y-1">
            <p>MODEL: gemini-3.5-flash-latest</p>
            <p>ROUTING: Proxy Node Server (/api/assistant)</p>
          </div>
        </div>

        {/* Right Active Chat Interface */}
        <div className="lg:col-span-8 flex flex-col bg-[#11141a] border border-[#30363d] rounded-lg overflow-hidden shadow-2xl relative">
          
          {/* Header indicator */}
          <div className="bg-[#171c22] border-b border-[#30363d] px-5 py-3.5 flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#00a3ff]" />
            <span className="font-mono text-xs font-bold text-white tracking-wide uppercase">
              Secure Channel uplink (SENTINEL_AI Console)
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 terminal-scroll bg-[#0b0e14]">
            {chatHistory.map((msg) => {
              const isOperator = msg.sender === "OPERATOR";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOperator ? "justify-end" : "justify-start"} items-start gap-3`}
                >
                  {!isOperator && (
                    <div className="w-7 h-7 rounded bg-sky-500/10 border border-[#00a3ff]/35 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-[#00a3ff]" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-lg border p-4 shadow-md ${
                    isOperator
                      ? "bg-sky-950/20 border-sky-500/20 text-[#dfe3ea] rounded-tr-none ml-12"
                      : "bg-[#161b22] border-[#30363d] rounded-tl-none mr-12"
                  }`}>
                    {/* Username line */}
                    <div className="flex justify-between items-center mb-2 font-mono text-[9px] text-[#88919d] border-b border-[#30363d]/30 pb-1">
                      <span className="font-bold uppercase tracking-wider">
                        {isOperator ? "OP_ADMIN" : "SENTINEL_SECURITY_CORE"}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Formatted body */}
                    <div className="space-y-1 text-xs">
                      {renderFormattedMarkdown(msg.text)}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start items-center gap-3">
                <div className="w-7 h-7 rounded bg-sky-500/10 border border-[#00a3ff]/35 flex items-center justify-center animate-spin shrink-0">
                  <RefreshCw className="w-4 h-4 text-[#00a3ff]" />
                </div>
                <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-lg rounded-tl-none font-mono text-[10px] text-[#88919d] flex items-center gap-2">
                  <span>Synthesizing structural remediation policy...</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping inline-block" />
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>

          {/* Form input controls */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3.5 bg-[#171c22] border-t border-[#30363d] flex gap-3.5"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-[#11141a] border border-[#30363d] focus:border-[#00a3ff] rounded-md px-4 py-2.5 outline-none font-mono text-xs text-white placeholder-[#bec7d4]/30"
              placeholder="Ask Sentinel to debug logs, fix code, or explore CVE guidelines..."
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-2.5 bg-[#00a3ff] hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all rounded-md text-black flex items-center justify-center gap-1.5 font-mono text-xs font-bold shadow shadow-[#00a3ff]/20"
            >
              <Send className="w-3.5 h-3.5" />
              Transmit
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
