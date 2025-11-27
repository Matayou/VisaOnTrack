# Coordination Templates

This directory contains templates for consistent coordination documents.

## Available Templates

### 1. Task Coordination Template
**File:** `TEMPLATE_TASK_COORDINATION.md`

**Use When:**
- Starting a new task
- Need to track task progress across multiple agents
- Coordinating implementation and reviews

**Contains:**
- Task overview and status
- Agent assignments with action items
- Review status tracking
- Blocker identification
- Next actions planning

---

### 2. Review Coordination Template
**File:** `TEMPLATE_REVIEW_COORDINATION.md`

**Use When:**
- Coordinating multi-agent reviews
- Tracking review progress
- Need review prompts for agents

**Contains:**
- Review status tracker for all agents
- Review prompts for each agent
- Review progress tracking
- Blocker identification

---

## How to Use Templates

1. **Copy the template** to create a new coordination document
2. **Rename** to match your task: `COORDINATION_[TASK_ID]_[PURPOSE].md`
3. **Fill in** the task-specific information
4. **Update** as progress is made
5. **Archive** to `docs/archive/coordination-completed/` when task is complete

## Example Usage

```bash
# Create new task coordination doc
cp docs/coordination/TEMPLATES/TEMPLATE_TASK_COORDINATION.md \
   docs/coordination/COORDINATION_M1_FE_6_PROVIDER_ONBOARDING.md

# Edit the new file with task-specific information
```

## Best Practices

1. **Keep it current** — Update status as work progresses
2. **Be specific** — Clear action items with owners
3. **Track blockers** — Document and resolve quickly
4. **Link documents** — Reference related docs
5. **Archive when done** — Move to archive directory

---

**Created:** 2025-01-11  
**Purpose:** Ensure consistent coordination across all tasks

