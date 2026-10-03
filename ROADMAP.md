# DEVPILOT AI - INTELLIGENT DEVELOPER ASSISTANT
## PRODUCT ROADMAP (for Antigravity IDE context)

### VISION
DevPilot AI is an intelligent developer assistant living inside the IDE and
across the dev workflow (CLI, CI, PR review). It helps engineers write,
debug, test, and ship code faster, using suggestions grounded in the actual
codebase rather than generic completions.

North star metric: time from intent to merged, working code.

### GUIDING PRINCIPLES
- **Context-first**: every suggestion grounded in the repo, not just the prompt
- **Trust through transparency**: show reasoning and diffs, never silent edits
- **Progressive autonomy**: start as suggestion tool, earn autonomous action
- **Model-agnostic core**: swappable LLM backend (Claude, GPT, local models)

### PHASE 0 - FOUNDATION & DISCOVERY (Weeks 1-3)
**Goal:** validate scope, lock architecture
- Define target user and top 3 workflows to nail first
- Architecture decision: extension host vs standalone fork vs LSP-based agent
- Choose model routing layer (single provider vs multi-model abstraction)
- Define context ingestion strategy (file tree, git history, symbol graph, RAG)
- Draft security and data handling policy
*Deliverable:* Architecture Decision Record + system diagram

### PHASE 1 - MVP CORE ASSISTANT LOOP (Weeks 4-8)
**Goal:** working chat + inline-edit assistant scoped to one repo
- Codebase indexing (embeddings, incremental updates on save)
- Chat panel with repo-aware context injection
- Inline code completion (single-line and block)
- "Explain this code" / "Explain this error" commands
- Diff-based edit proposals (confirm before applying)
- Basic terminal/error-log ingestion for debugging
*Deliverable:* internal alpha on 1-2 real repos

### PHASE 2 - CORE DEVELOPER WORKFLOWS (Weeks 9-16)
**Goal:** cover the daily dev loop end-to-end
- Multi-file refactoring with dependency-aware impact preview
- Automated test generation from function signature + usage
- PR description and changelog generation from diff
- Git-aware "what changed and why" summaries
- Bug reproduction assistant (stack trace -> likely root cause)
- Task/plan mode: break feature requests into scoped sub-tasks
*Deliverable:* closed beta with 10-20 external teams

### PHASE 3 - AGENTIC AUTONOMY (Weeks 17-24)
**Goal:** move from "suggests" to "does", with guardrails
- Multi-step autonomous execution (branch -> implement -> test -> PR)
- Self-verification loop (run tests/linters, iterate before presenting)
- Sandboxed execution environment for agent-run code
- Permission model: per-project autonomy levels
- Rollback/undo system for agent-made changes
- CI integration (agent responds to failing builds)
*Deliverable:* public beta

### PHASE 4 - TEAM & ENTERPRISE SCALE (Weeks 25-36)
**Goal:** org-wide deployment readiness
- Team knowledge base (conventions, style guides, architecture docs)
- Role-based access control + audit log of agent actions
- On-prem/VPC deployment option
- Usage analytics dashboard (time saved, acceptance rate, cycle time)
- SSO, billing, seat management
- Plugin/extension SDK for internal tools
*Deliverable:* GA launch, enterprise pilot program

### PHASE 5 - ECOSYSTEM & DIFFERENTIATION (Ongoing)
- Multi-IDE support (JetBrains, Neovim, Antigravity-native)
- Model fine-tuning on org's own codebase (private, opt-in)
- Voice-driven coding mode
- Marketplace for community-built agent skills

### SUCCESS METRICS BY PHASE
- **MVP:** daily active usage, suggestion acceptance rate
- **Core workflows:** time-to-PR reduction, test coverage delta
- **Agentic:** % tasks completed without human correction
- **Enterprise:** seat retention, expansion within org

### OPEN RISKS & DECISIONS NEEDED
- Default autonomy level vs opt-in
- Data residency for code context (enterprise sales blocker)
- Cost model: token pass-through vs flat subscription
- Differentiation vs Copilot/Cursor/Cody: likely bet is deeper repo context + safer autonomy controls
