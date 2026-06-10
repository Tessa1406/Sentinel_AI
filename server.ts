import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Lazy-initialization of Gemini client to prevent startup crash if API key is not present
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI Assistant will operate in fallback mode.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Assistant query endpoint
app.post("/api/assistant", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response for missing API key
      const fallbackReplies: Record<string, string> = {
        "EXPLAIN SQLi": "### [SENTINEL_AI] Heuristic Analysis - SQL Injection (SQLi)\n\nSQL Injection is a dangerous vulnerability where an attacker manipulates SQL inputs to execute arbitrary queries on your Database (such as PostgreSQL).\n\n#### Remediation Guide:\nUse **prepared statements** or **parameterized queries** instead of raw string interpolation.\n\n```js\n// ❌ VULNERABLE\nconst query = `SELECT * FROM users WHERE id = ${userInput}`;\n\n// ✅ SECURE\nconst query = 'SELECT * FROM users WHERE id = $1';\nconst values = [userInput];\nawait client.query(query, values);\n```",
        "RECENT CVEs": "### [SENTINEL_AI] High Severity vulnerabilities in the IoT Stack:\n\n1. **CVE-2024-8812**: Industrial Controller Remote Code Execution (CVSS 9.8 - Critical)\n2. **CVE-2023-4412**: Smart Gateway Buffer Overflow (CVSS 6.5 - Moderate)\n3. **CVE-2024-1011**: Network Switch Missing Authentication (CVSS 4.2 - Low)",
        "AUDIT ENDPOINTS": "### [SENTINEL_AI] Endpoint Audit Report:\n\n- `/api/v1/user/auth`: **WARNING** - Potential CWE-89 SQL Injection detected in authentication parsing layers.\n- `/api/v1/sensors/data`: **SECURE** - Input validated with static parser constraints.\n- `/api/v1/system/reboot`: **CRITICAL** - Lacks operational authorization parameters.",
        "REVIEW CODE": "### [SENTINEL_AI] Code Sanitization Review:\n\nChecking file inputs and SQL queries... Found 1 suspicious interpolation pattern on user inputs. Please enforce parameterized query standards globally."
      };

      const cleanQuery = message.trim().toUpperCase();
      let reply = fallbackReplies[cleanQuery] || `### [OFFLINE FALLBACK] Sentinel AI\n\nI received your query: "${message}".\n\n*Note: To enable fully reactive, real-time AI responses, please add your **GEMINI_API_KEY** in the AI Studio Secrets panel.*`;
      
      res.json({ text: reply, isFallback: true });
      return;
    }

    // Convert client-side message history to Gemini contents structure
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }

    // Append current prompt
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: `You are SENTINEL_AI, an advanced, highly specialized autonomous cyber-defense agent and terminal assistant operating under CYBER_SHELL.
Your objective is to provide elite advisory services, debug security logs, explain vulnerabilities (like SQL Injection, XSS, Certificate strengths, buffer bounds), and generate high-fidelity secure patches or remediation policies.
Style regulations:
1. Always keep responses strictly technical, factual, and crisp.
2. Structure your replies using beautiful Markdown display. Use headings, lists, bold concepts, and clean Code Blocks.
3. For vulnerable patterns, explicitly provide the raw bug visual followed by the Secure Remediation block. E.g. use standard parameterized queries, sanitize inputs, or enforce policy layers.
4. Keep the tone elite, secure, helpful, and precise. Avoid unnecessary fluff.`,
      }
    });

    res.json({ text: response.text || "No response received from Sentinel Core." });
  } catch (error: any) {
    console.error("Gemini assistant error:", error);
    res.status(500).json({ error: error.message || "Internal server error communicating with Sentinel AI Core." });
  }
});

// Start routing with Vite middleware or static server
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SENTINEL_BACKEND] Server listening on http://0.0.0.0:${PORT}`);
  });
}

initializeServer();
