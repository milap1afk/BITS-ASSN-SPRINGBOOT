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

const MODEL = "llama-3.3-70b-versatile";

// ─── Tool Implementations ────────────────────────────────────────────

/** Execute a shell command and return its output. */
async function executeCommand(cmd = "") {
  return new Promise((res) => {
    exec(cmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) res(`Error: ${error.message}`);
      else res(stdout || stderr || `Command executed successfully: ${cmd}`);
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
5. When cloning a website, generate a COMPLETE single HTML file with embedded CSS and JS.
6. Make clones visually accurate — proper layout, colors, fonts, gradients, responsive design.
7. After creating the HTML file, use openInBrowser to show the result.
8. OUTPUT ends the task. Use only when fully done.

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
