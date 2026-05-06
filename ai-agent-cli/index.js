// ═══════════════════════════════════════════════════════════════════════
//  AI Agent CLI Tool — Conversational Website Cloning Agent
//  
//  A terminal-based AI agent that accepts natural language instructions
//  and generates working HTML/CSS/JS websites using an iterative
//  reasoning loop: START → THINK → TOOL → OBSERVE → OUTPUT
// ═══════════════════════════════════════════════════════════════════════

import "dotenv/config";
import { OpenAI } from "openai";
import { exec } from "child_process";
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, resolve } from "path";
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
  bgMagenta: "\x1b[45m",
};

function log(color, icon, label, msg) {
  console.log(`\n${color}${C.bold}  ${icon}  ${label}${C.reset}`);
  if (msg) console.log(`${C.dim}     ${msg}${C.reset}`);
}

// ─── OpenAI Client ───────────────────────────────────────────────────
const client = new OpenAI();

// ─── Tool Implementations ────────────────────────────────────────────

/**
 * Execute a shell command and return its output.
 * Used for mkdir, ls, open, etc.
 */
async function executeCommand(cmd = "") {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        resolve(`Error: ${error.message}`);
      } else {
        resolve(stdout || stderr || `Command executed successfully: ${cmd}`);
      }
    });
  });
}

/**
 * Create or overwrite a file with given content.
 * Automatically creates parent directories.
 */
async function createFile({ filePath, content }) {
  try {
    const dir = filePath.substring(0, filePath.lastIndexOf("/"));
    if (dir && !existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(filePath, content, "utf-8");
    return `File created successfully: ${filePath} (${content.length} bytes)`;
  } catch (err) {
    return `Error creating file: ${err.message}`;
  }
}

/**
 * Read the contents of a file.
 */
async function readFile({ filePath }) {
  try {
    if (!existsSync(filePath)) {
      return `Error: File not found: ${filePath}`;
    }
    const content = readFileSync(filePath, "utf-8");
    return content;
  } catch (err) {
    return `Error reading file: ${err.message}`;
  }
}

/**
 * List files in a directory.
 */
async function listFiles({ dirPath }) {
  try {
    if (!existsSync(dirPath)) {
      return `Error: Directory not found: ${dirPath}`;
    }
    const files = readdirSync(dirPath);
    return files.length > 0 ? files.join("\n") : "(empty directory)";
  } catch (err) {
    return `Error listing files: ${err.message}`;
  }
}

/**
 * Open a file in the default browser.
 */
async function openInBrowser({ filePath }) {
  const absPath = resolve(filePath);
  // macOS: open, Linux: xdg-open, Windows: start
  const cmd = process.platform === "darwin"
    ? `open "${absPath}"`
    : process.platform === "win32"
    ? `start "${absPath}"`
    : `xdg-open "${absPath}"`;

  return executeCommand(cmd);
}

// ─── Tool Registry ───────────────────────────────────────────────────
const TOOLS = {
  executeCommand: {
    fn: (args) => executeCommand(args.cmd),
    desc: "Execute a shell command (mkdir, ls, etc.)",
  },
  createFile: {
    fn: createFile,
    desc: "Create/write a file with content",
  },
  readFile: {
    fn: readFile,
    desc: "Read contents of a file",
  },
  listFiles: {
    fn: listFiles,
    desc: "List files in a directory",
  },
  openInBrowser: {
    fn: openInBrowser,
    desc: "Open an HTML file in the default browser",
  },
};

// ─── System Prompt ───────────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are an AI Agent running inside a CLI terminal. You work in an iterative loop of:
START → THINK → TOOL → OBSERVE → THINK → TOOL → OBSERVE → ... → OUTPUT

You break down complex tasks into small steps, executing one tool call at a time, 
and waiting for the observation before proceeding to the next step.

## Available Tools

1. **executeCommand** — Run a shell command on the user's machine.
   Args: { "cmd": "string" }

2. **createFile** — Create or overwrite a file with content.
   Args: { "filePath": "string", "content": "string" }

3. **readFile** — Read the contents of a file.
   Args: { "filePath": "string" }

4. **listFiles** — List all files in a directory.
   Args: { "dirPath": "string" }

5. **openInBrowser** — Open an HTML file in the default browser.
   Args: { "filePath": "string" }

## Response Format (STRICT JSON)

You must ALWAYS respond with a single JSON object in one of these formats:

{ "step": "START", "content": "Brief description of what you understand from the user request" }
{ "step": "THINK", "content": "Your reasoning about what to do next" }
{ "step": "TOOL", "content": "What this tool call does", "tool_name": "toolName", "tool_args": { ... } }
{ "step": "OUTPUT", "content": "Final message to the user summarizing what was done" }

## Critical Rules

1. ALWAYS output valid JSON — no markdown, no extra text, just one JSON object per response.
2. Do ONE step at a time. After a TOOL step, STOP and wait for the OBSERVE result.
3. THINK multiple times before acting. Plan first, then execute.
4. After every TOOL call, wait for OBSERVE, then THINK about the result.
5. Use createFile to write HTML/CSS/JS files. Use openInBrowser to show the result.
6. When cloning a website, create a COMPLETE single-page HTML file with embedded CSS and JS.
7. Make the clone visually accurate — include proper layout, colors, fonts, gradients, responsive design.
8. Always create files inside an "output/" directory relative to where the agent runs.
9. When finished, use openInBrowser to open the final HTML file, then respond with OUTPUT step.
10. The OUTPUT step ends the current task. Use it only when everything is complete.
`;

// ─── Agent Loop ──────────────────────────────────────────────────────

/**
 * Process a single user message through the agent loop.
 * The agent iterates through START/THINK/TOOL/OBSERVE/OUTPUT steps
 * until it reaches an OUTPUT step or hits the max iteration limit.
 */
async function agentLoop(userMessage, conversationHistory) {
  // Add user message to history
  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  const MAX_ITERATIONS = 30;
  let iteration = 0;

  while (iteration < MAX_ITERATIONS) {
    iteration++;

    try {
      // Call OpenAI API
      const response = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: conversationHistory,
        temperature: 0.1,
      });

      const rawContent = response.choices[0].message.content.trim();

      // Parse JSON response
      let parsed;
      try {
        // Handle potential markdown code blocks
        const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch (parseErr) {
        console.log(`${C.red}  ⚠  JSON Parse Error: ${parseErr.message}${C.reset}`);
        console.log(`${C.dim}     Raw: ${rawContent.substring(0, 200)}${C.reset}`);
        // Push error as developer message and retry
        conversationHistory.push({
          role: "assistant",
          content: rawContent,
        });
        conversationHistory.push({
          role: "user",
          content: JSON.stringify({
            step: "OBSERVE",
            content: "Your response was not valid JSON. Please respond with ONLY a valid JSON object.",
          }),
        });
        continue;
      }

      // Add assistant response to history
      conversationHistory.push({
        role: "assistant",
        content: JSON.stringify(parsed),
      });

      // ─── Handle each step type ─────────────────────────────

      if (parsed.step === "START") {
        log(C.bgBlue + C.white, "🚀", "START", parsed.content);
      }

      else if (parsed.step === "THINK") {
        log(C.yellow, "🧠", "THINK", parsed.content);
      }

      else if (parsed.step === "TOOL") {
        log(C.cyan, "🔧", `TOOL → ${parsed.tool_name}`, parsed.content);

        const toolName = parsed.tool_name;
        const toolArgs = parsed.tool_args;

        if (!TOOLS[toolName]) {
          // Unknown tool
          const errMsg = `Tool "${toolName}" is not available. Available tools: ${Object.keys(TOOLS).join(", ")}`;
          log(C.red, "❌", "ERROR", errMsg);
          conversationHistory.push({
            role: "user",
            content: JSON.stringify({ step: "OBSERVE", content: errMsg }),
          });
        } else {
          // Execute the tool
          try {
            const result = await TOOLS[toolName].fn(toolArgs);
            const resultStr = typeof result === "object" ? JSON.stringify(result) : String(result);
            const displayResult = resultStr.length > 300
              ? resultStr.substring(0, 300) + "... (truncated)"
              : resultStr;

            log(C.green, "👁", "OBSERVE", displayResult);

            conversationHistory.push({
              role: "user",
              content: JSON.stringify({ step: "OBSERVE", content: resultStr }),
            });
          } catch (toolErr) {
            const errMsg = `Tool execution error: ${toolErr.message}`;
            log(C.red, "❌", "TOOL ERROR", errMsg);
            conversationHistory.push({
              role: "user",
              content: JSON.stringify({ step: "OBSERVE", content: errMsg }),
            });
          }
        }
      }

      else if (parsed.step === "OUTPUT") {
        log(C.green + C.bold, "✅", "OUTPUT", parsed.content);
        return; // Task complete
      }

      else {
        log(C.red, "❓", "UNKNOWN STEP", `Unknown step: ${parsed.step}`);
      }

    } catch (apiErr) {
      console.log(`\n${C.red}  ⚠  API Error: ${apiErr.message}${C.reset}`);
      if (apiErr.message.includes("rate_limit")) {
        console.log(`${C.dim}     Waiting 5 seconds before retry...${C.reset}`);
        await new Promise((r) => setTimeout(r, 5000));
      } else {
        break;
      }
    }
  }

  if (iteration >= MAX_ITERATIONS) {
    console.log(`\n${C.yellow}  ⚠  Reached maximum iterations (${MAX_ITERATIONS}). Stopping.${C.reset}`);
  }
}

// ─── Interactive CLI ─────────────────────────────────────────────────

function printBanner() {
  console.log(`
${C.cyan}${C.bold}  ╔══════════════════════════════════════════════════════╗
  ║            🤖  AI Agent CLI Tool  🤖                ║
  ║     Conversational Website Cloning Agent             ║
  ╚══════════════════════════════════════════════════════╝${C.reset}
  ${C.dim}Type your instructions and the agent will break them down,
  reason through them, and produce working HTML/CSS/JS files.
  
  Type ${C.white}"exit"${C.dim} or ${C.white}"quit"${C.dim} to leave.${C.reset}
`);
}

async function main() {
  printBanner();

  // Ensure output directory exists
  if (!existsSync("output")) {
    mkdirSync("output");
  }

  // Initialize conversation with system prompt
  const conversationHistory = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  // Create readline interface for interactive chat
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = () => {
    rl.question(`\n${C.magenta}${C.bold}  You ▶ ${C.reset}`, async (input) => {
      const trimmed = input.trim();

      if (!trimmed) {
        prompt();
        return;
      }

      if (trimmed.toLowerCase() === "exit" || trimmed.toLowerCase() === "quit") {
        console.log(`\n${C.cyan}  👋  Goodbye!${C.reset}\n`);
        rl.close();
        process.exit(0);
      }

      // Run the agent loop for this user message
      await agentLoop(trimmed, conversationHistory);

      // Prompt for next input
      prompt();
    });
  };

  prompt();
}

// ─── Entry Point ─────────────────────────────────────────────────────
main();
