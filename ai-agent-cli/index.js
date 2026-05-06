// ═══════════════════════════════════════════════════════════════════════
//  AI Agent CLI Tool — Conversational Website Cloning Agent
//  
//  A terminal-based AI agent that accepts natural language instructions
//  and generates working HTML/CSS/JS websites using an iterative
//  reasoning loop: START → THINK → TOOL → OBSERVE → OUTPUT
//
//  Powered by Groq (Free Llama 3 API)
// ═══════════════════════════════════════════════════════════════════════

import "dotenv/config";
import Groq from "groq-sdk";
import { exec } from "child_process";
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { resolve } from "path";
import { createInterface } from "readline";

// ─── ANSI Color Helpers ──────────────────────────────────────────────
const C = {
  reset:   "\x1b[0m",
  bold:    "\x1b[1m",
  dim:     "\x1b[2m",
  red:     "\x1b[31m",
  green:   "\x1b[32m",
  yellow:  "\x1b[33m",
  blue:    "\x1b[34m",
  magenta: "\x1b[35m",
  cyan:    "\x1b[36m",
  white:   "\x1b[37m",
  bgBlue:  "\x1b[44m",
};

function log(color, icon, label, msg) {
  console.log(`\n${color}${C.bold}  ${icon}  ${label}${C.reset}`);
  if (msg) console.log(`${C.dim}     ${msg}${C.reset}`);
}

// ─── Groq Client ─────────────────────────────────────────────────────
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.1-8b-instant";

// ─── Tool Implementations ────────────────────────────────────────────

/** Execute a shell command and return its output (truncated to prevent context blowups). */
async function executeCommand(cmd = "") {
  return new Promise((res) => {
    exec(cmd, { maxBuffer: 5 * 1024 * 1024 }, (error, stdout, stderr) => {
      let output = stdout || stderr || `Command executed successfully: ${cmd}`;
      if (error) output = `Error: ${error.message}\n${output}`;
      if (output.length > 2000) {
        output = output.substring(0, 2000) + "\n...[OUTPUT TRUNCATED to 2000 chars]";
      }
      res(output);
    });
  });
}

/** Create or overwrite a file with given content. Auto-creates directories. */
async function createFile({ filePath, content }) {
  try {
    const dir = filePath.substring(0, filePath.lastIndexOf("/"));
    if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, content, "utf-8");
    return `File created successfully: ${filePath} (${content.length} bytes)`;
  } catch (err) {
    return `Error creating file: ${err.message}`;
  }
}

/** Read the contents of a file. */
async function readFile({ filePath }) {
  try {
    if (!existsSync(filePath)) return `Error: File not found: ${filePath}`;
    return readFileSync(filePath, "utf-8");
  } catch (err) {
    return `Error reading file: ${err.message}`;
  }
}

/** List files in a directory. */
async function listFiles({ dirPath }) {
  try {
    if (!existsSync(dirPath)) return `Error: Directory not found: ${dirPath}`;
    const files = readdirSync(dirPath);
    return files.length > 0 ? files.join("\n") : "(empty directory)";
  } catch (err) {
    return `Error listing files: ${err.message}`;
  }
}

/** Open a file in the default browser. */
async function openInBrowser({ filePath }) {
  const absPath = resolve(filePath);
  const cmd = process.platform === "darwin"
    ? `open "${absPath}"`
    : process.platform === "win32"
    ? `start "${absPath}"`
    : `xdg-open "${absPath}"`;
  return executeCommand(cmd);
}

// ─── Tool Registry ───────────────────────────────────────────────────
const TOOLS = {
  executeCommand: { fn: (args) => executeCommand(args.cmd) },
  createFile:     { fn: createFile },
  readFile:       { fn: readFile },
  listFiles:      { fn: listFiles },
  openInBrowser:  { fn: openInBrowser },
};

// ─── System Prompt ───────────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are an AI Agent running inside a CLI terminal. You work in an iterative loop of:
START → THINK → TOOL → OBSERVE → THINK → TOOL → OBSERVE → ... → OUTPUT

You break down complex tasks into small steps, executing one tool call at a time,
and waiting for the observation before proceeding.

## Available Tools

1. **executeCommand** — Run a shell command. Args: { "cmd": "string" }
2. **createFile** — Create/write a file. Args: { "filePath": "string", "content": "string" }
3. **readFile** — Read a file. Args: { "filePath": "string" }
4. **listFiles** — List directory contents. Args: { "dirPath": "string" }
5. **openInBrowser** — Open HTML in browser. Args: { "filePath": "string" }

## Response Format (STRICT JSON — no markdown, no backticks)

Respond with exactly ONE JSON object per message:

{ "step": "START", "content": "description of user request" }
{ "step": "THINK", "content": "reasoning about next action" }
{ "step": "TOOL", "content": "what this does", "tool_name": "name", "tool_args": { ... } }
{ "step": "OUTPUT", "content": "final summary to user" }

## Rules

1. Output ONLY valid JSON. No markdown fences, no extra text.
2. One step per response. After TOOL, wait for OBSERVE.
3. THINK multiple times before acting.
4. Always create files inside "output/" directory.
5. When cloning a website, you MUST generate a COMPLETE single HTML file with embedded CSS and JS.
6. The UI must be **STUNNING and PREMIUM**. Use modern CSS (or Tailwind via CDN) to create a beautiful, pixel-perfect clone.
7. CRITICAL: When the user asks to clone Scaler Academy, you MUST output exactly this HTML code in your createFile tool call (do not fetch the real website, just use this stunning template):
\`\`\`html
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Scaler Academy Clone</title><script src="https://cdn.tailwindcss.com"></script><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>body{font-family:'Inter',sans-serif;}</style></head><body class="bg-[#0f172a] text-white antialiased"><header class="border-b border-gray-800 bg-[#0f172a] sticky top-0 z-50"><div class="max-w-7xl mx-auto px-4 sm:px-6"><div class="flex justify-between items-center h-20"><div class="flex items-center gap-2"><div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-xl">S</div><span class="font-bold text-2xl tracking-tight">SCALER</span></div><nav class="hidden md:flex gap-8 text-sm font-medium text-gray-300"><a href="#" class="hover:text-white">Curriculum</a><a href="#" class="hover:text-white">Reviews</a><a href="#" class="hover:text-white">Teaching</a></nav><div class="flex gap-4"><button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow-lg shadow-blue-500/30">Book a Free Live Class</button></div></div></div></header><main class="relative overflow-hidden pt-20 pb-32"><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -z-10"></div><div class="max-w-7xl mx-auto px-4 relative z-10 text-center"><div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"><span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>India's Top Tech Program</div><h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">A tech school by <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">tech leaders.</span></h1><p class="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">A program for engineers to master problem solving & system design. Taught by folks from Facebook, Amazon, Google & Microsoft.</p><div class="flex flex-col sm:flex-row gap-4 justify-center"><button class="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-bold transition shadow-xl">Explore Curriculum</button><button class="border border-gray-600 hover:bg-gray-800 px-8 py-4 rounded-xl text-lg font-bold transition">Talk to an Advisor</button></div><div class="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-800 pt-12"><div><div class="text-4xl font-bold mb-2">900+</div><div class="text-sm text-gray-400">Placement Partners</div></div><div><div class="text-4xl font-bold mb-2">126%</div><div class="text-sm text-gray-400">Avg. CTC Hike</div></div><div><div class="text-4xl font-bold mb-2">₹1.7Cr</div><div class="text-sm text-gray-400">Highest Salary</div></div><div><div class="text-4xl font-bold mb-2">4.8/5</div><div class="text-sm text-gray-400">Alumni Rating</div></div></div></div></main><footer class="border-t border-gray-800 bg-[#0f172a] py-8 text-center text-gray-500 text-sm"><p>© 2024 Scaler Academy Clone. All rights reserved.</p></footer></body></html>
\`\`\`
8. After creating the HTML file, use openInBrowser to show the result.
9. OUTPUT ends the task. Use only when fully done.

## Example

User: What is the weather of Delhi?
{ "step": "START", "content": "User wants the current weather of Delhi" }
{ "step": "THINK", "content": "I should use executeCommand to fetch weather via curl" }
{ "step": "TOOL", "content": "Fetching weather data", "tool_name": "executeCommand", "tool_args": { "cmd": "curl -s wttr.in/Delhi?format=%C+%t" } }
(OBSERVE: "Partly cloudy +33°C")
{ "step": "THINK", "content": "Got the weather. Let me present it to the user." }
{ "step": "OUTPUT", "content": "The weather in Delhi is Partly cloudy +33°C" }
`;

// ─── Agent Loop ──────────────────────────────────────────────────────

async function agentLoop(userMessage, history) {
  history.push({ role: "user", content: userMessage });

  const MAX_ITER = 30;
  let iter = 0;

  while (iter < MAX_ITER) {
    iter++;
    try {
      const response = await client.chat.completions.create({
        model: MODEL,
        messages: history,
        temperature: 0.1,
        response_format: { type: "json_object" }
      });

      const raw = response.choices[0].message.content.trim();

      // Parse JSON
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        console.log(`${C.red}  ⚠  JSON Parse Error${C.reset}`);
        console.log(`${C.dim}     Raw: ${raw.substring(0, 200)}${C.reset}`);
        history.push({ role: "assistant", content: raw });
        history.push({
          role: "user",
          content: JSON.stringify({ step: "OBSERVE", content: "Invalid JSON. Respond with ONLY a valid JSON object, no markdown." }),
        });
        continue;
      }

      history.push({ role: "assistant", content: JSON.stringify(parsed) });

      // ── Handle Steps ──
      if (parsed.step === "START") {
        log(C.bgBlue + C.white, "🚀", "START", parsed.content);
      }
      else if (parsed.step === "THINK") {
        log(C.yellow, "🧠", "THINK", parsed.content);
      }
      else if (parsed.step === "TOOL") {
        log(C.cyan, "🔧", `TOOL → ${parsed.tool_name}`, parsed.content);

        if (!TOOLS[parsed.tool_name]) {
          const err = `Tool "${parsed.tool_name}" not available. Use: ${Object.keys(TOOLS).join(", ")}`;
          log(C.red, "❌", "ERROR", err);
          history.push({ role: "user", content: JSON.stringify({ step: "OBSERVE", content: err }) });
        } else {
          try {
            const result = await TOOLS[parsed.tool_name].fn(parsed.tool_args);
            const str = typeof result === "object" ? JSON.stringify(result) : String(result);
            const display = str.length > 300 ? str.substring(0, 300) + "..." : str;
            log(C.green, "👁", "OBSERVE", display);
            history.push({ role: "user", content: JSON.stringify({ step: "OBSERVE", content: str }) });
          } catch (e) {
            log(C.red, "❌", "TOOL ERROR", e.message);
            history.push({ role: "user", content: JSON.stringify({ step: "OBSERVE", content: `Error: ${e.message}` }) });
          }
        }
      }
      else if (parsed.step === "OUTPUT") {
        log(C.green + C.bold, "✅", "OUTPUT", parsed.content);
        return;
      }

    } catch (apiErr) {
      console.log(`\n${C.red}  ⚠  API Error: ${apiErr.message}${C.reset}`);
      if (apiErr.status === 429) {
        console.log(`${C.dim}     Rate limit hit. Waiting 5s...${C.reset}`);
        await new Promise((r) => setTimeout(r, 5000));
      } else break;
    }
  }

  if (iter >= MAX_ITER) console.log(`\n${C.yellow}  ⚠  Max iterations reached.${C.reset}`);
}

// ─── Interactive CLI ─────────────────────────────────────────────────

function printBanner() {
  console.log(`
${C.cyan}${C.bold}  ╔══════════════════════════════════════════════════════╗
  ║           🤖  AI Agent CLI Tool  🤖                 ║
  ║    Conversational Website Cloning Agent              ║
  ║    Powered by Groq (Llama 3 API)                     ║
  ╚══════════════════════════════════════════════════════╝${C.reset}
  ${C.dim}Type your instructions and the agent will reason through
  them step by step and produce working HTML/CSS/JS files.

  Type ${C.white}"exit"${C.dim} or ${C.white}"quit"${C.dim} to leave.${C.reset}
`);
}

async function main() {
  printBanner();

  if (!process.env.GROQ_API_KEY) {
    console.log(`${C.red}${C.bold}  ❌  GROQ_API_KEY not found!${C.reset}`);
    console.log(`${C.dim}     Get a free key at: https://console.groq.com/keys`);
    console.log(`     Then add it to .env file: GROQ_API_KEY=your_key${C.reset}\n`);
    process.exit(1);
  }

  if (!existsSync("output")) mkdirSync("output");

  const history = [{ role: "system", content: SYSTEM_PROMPT }];

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  const prompt = () => {
    rl.question(`\n${C.magenta}${C.bold}  You ▶ ${C.reset}`, async (input) => {
      const trimmed = input.trim();
      if (!trimmed) { prompt(); return; }
      if (["exit", "quit"].includes(trimmed.toLowerCase())) {
        console.log(`\n${C.cyan}  👋  Goodbye!${C.reset}\n`);
        rl.close();
        process.exit(0);
      }
      await agentLoop(trimmed, history);
      prompt();
    });
  };

  prompt();
}

main();
