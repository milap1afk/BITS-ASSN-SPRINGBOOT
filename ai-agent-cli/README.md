# 🤖 AI Agent CLI Tool

A conversational CLI agent that runs in the terminal and accepts natural language instructions. The agent can **clone the Scaler Academy website** by generating fully working HTML, CSS, and JavaScript files.

Built with an **iterative agent loop** — the agent reasons through the task step by step, takes actions using tools, observes results, and loops until the task is complete.

## 🎯 Features

- **Interactive CLI** — Chat with the agent directly in your terminal
- **Agent Reasoning Loop** — Follows START → THINK → TOOL → OBSERVE → OUTPUT pattern
- **5 Built-in Tools**:
  - `executeCommand` — Run shell commands (mkdir, ls, etc.)
  - `createFile` — Create/write files (HTML, CSS, JS)
  - `readFile` — Read file contents
  - `listFiles` — List directory contents
  - `openInBrowser` — Open HTML files in default browser
- **Auto Browser Launch** — Generated website opens automatically
- **Colorful Output** — Each reasoning step is color-coded in the terminal

## 📦 Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| AI Model | OpenAI GPT-4.1-mini |
| Architecture | ReAct Agent Loop |
| Output | HTML + CSS + JS |

## 🚀 Setup

### Prerequisites

- Node.js (v18 or later)
- OpenAI API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/milap1afk/BITS-ASSN-SPRINGBOOT.git
cd BITS-ASSN-SPRINGBOOT/ai-agent-cli

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your OpenAI API key to .env
# OPENAI_API_KEY=sk-your-key-here
```

### Running the Agent

```bash
npm start
# or
node index.js
```

## 💬 Usage

Once running, type your instruction in the terminal:

```
You ▶ Clone the Scaler Academy website with header, hero section, and footer
```

The agent will:
1. **START** — Understand the task
2. **THINK** — Plan the approach (multiple thinking steps)
3. **TOOL** — Create the output directory, generate HTML/CSS/JS
4. **OBSERVE** — Verify files were created
5. **TOOL** — Open the result in the browser
6. **OUTPUT** — Summarize what was done

## 🔄 Agent Loop Architecture

```
User Input
    │
    ▼
┌──────────┐
│  START   │ ── Understand the request
└────┬─────┘
     │
     ▼
┌──────────┐
│  THINK   │ ── Reason about what to do next
└────┬─────┘
     │
     ▼
┌──────────┐      ┌──────────┐
│   TOOL   │ ───▶ │ OBSERVE  │ ── Execute tool, get result
└────┬─────┘      └────┬─────┘
     │                 │
     ▼                 │
┌──────────┐           │
│  THINK   │ ◀─────────┘  ── Reason about the result
└────┬─────┘
     │
     ▼
   (loop back to TOOL or proceed to OUTPUT)
     │
     ▼
┌──────────┐
│  OUTPUT  │ ── Final response to user
└──────────┘
```

## 📁 Project Structure

```
ai-agent-cli/
├── index.js          # Main agent — CLI interface, tools, agent loop
├── package.json      # Dependencies and scripts
├── .env.example      # Environment variable template
├── .gitignore        # Git ignore rules
├── README.md         # This file
└── output/           # Generated website files (created at runtime)
    └── scaler-clone.html
```

## 📸 Demo

[YouTube Video Link — Coming Soon]

## 📝 License

MIT
