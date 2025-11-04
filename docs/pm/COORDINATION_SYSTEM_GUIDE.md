# Coordination System Guide — For PM

**Purpose:** Guide for maintaining the coordination system without clutter  
**Last Updated:** 2025-01-11

---

## 🎯 System Overview

The coordination system provides:
- **Single source of truth** for team status
- **Clear action items** for each agent
- **Consistent templates** for all coordination
- **Minimal clutter** through organized structure

---

## 📋 Core Documents

### 1. COORDINATION_HUB.md
**Purpose:** Central dashboard with current tasks, agent assignments, and blockers

**Update When:**
- New task assigned
- Task status changes
- Blocker identified/resolved
- Review completed
- Agent completes action item

**Update Frequency:** Daily (or when status changes)

**What to Update:**
- Current Active Tasks section
- Agent Action Items section
- Milestone Status section
- Blockers & Risks section

### 2. AGENT_STATUS_BOARD.md
**Purpose:** Agent-by-agent status and action items

**Update When:**
- Agent completes action
- Agent status changes
- New task assigned to agent
- Blocker affects agent

**Update Frequency:** Daily (or when agent status changes)

**What to Update:**
- Agent's current status
- Active tasks
- Action items
- Blockers
- Recent completions

---

## 🔄 Daily Workflow

### Morning Routine
1. **Check PROJECT_STATUS.md** — Overall project status
2. **Update COORDINATION_HUB.md** — Refresh current status
3. **Update AGENT_STATUS_BOARD.md** — Refresh agent statuses
4. **Identify blockers** — Document any new blockers
5. **Assign action items** — Clear action items for agents
6. **Commit if changes** — See `COMMIT_SCHEDULE.md`

### During Day
1. **As agents complete work** — Update status immediately → Commit
2. **As blockers resolve** — Move to resolved section → Commit
3. **As reviews complete** — Update review status → Commit
4. **As tasks complete** — Archive to archive directory → Commit

### End of Day
1. **Final status update** — Ensure hub is current
2. **Archive completed items** — Move to archive
3. **Commit changes** — See `COMMIT_SCHEDULE.md` for commit workflow
4. **Prepare next day** — Identify next actions

---

## 📝 Creating New Coordination Documents

### For New Task

1. **Copy template:**
   ```bash
   cp docs/coordination/TEMPLATES/TEMPLATE_TASK_COORDINATION.md \
      docs/coordination/COORDINATION_[TASK_ID]_[PURPOSE].md
   ```

2. **Fill in task details:**
   - Task name and ID
   - Assigned agent
   - Status
   - Action items
   - Dependencies

3. **Update COORDINATION_HUB.md:**
   - Add to "Current Active Tasks" section
   - Add agent action items
   - Update milestone status

4. **Update AGENT_STATUS_BOARD.md:**
   - Add task to assigned agent's section
   - Add action items
   - Update status

### For Review Coordination

1. **Copy template:**
   ```bash
   cp docs/coordination/TEMPLATES/TEMPLATE_REVIEW_COORDINATION.md \
      docs/coordination/COORDINATION_[TASK_ID]_REVIEW.md
   ```

2. **Fill in review details:**
   - Task information
   - Review prompts for each agent
   - Review status tracking

3. **Update COORDINATION_HUB.md:**
   - Link to review coordination doc
   - Update review status

---

## 🗂️ File Organization Rules

### Active Documents
- **Location:** `docs/coordination/`
- **Naming:** `COORDINATION_[TASK_ID]_[PURPOSE].md`
- **Keep:** Only active tasks
- **Archive:** When task complete

### Completed Documents
- **Location:** `docs/archive/coordination-completed/`
- **Move When:** Task complete, all reviews done, PM approved
- **Keep:** For historical reference

### Templates
- **Location:** `docs/coordination/TEMPLATES/`
- **Use:** For creating new coordination docs
- **Don't modify:** Unless system-wide change needed

---

## 📊 Status Tracking

### Task Status Options
- ⏳ **PENDING** — Not started
- ✅ **IN PROGRESS** — Active work
- ⚠️ **BLOCKED** — Blocked by dependency/issue
- ✅ **COMPLETE** — All work done, ready for archive

### Review Status Options
- ⏳ **PENDING** — Review not started
- ✅ **COMPLETE** — Review done
- ✅ **APPROVED** — Review approved
- ❌ **REJECTED** — Review rejected
- ⚠️ **APPROVED WITH CHANGES** — Approved but changes needed

---

## 🚨 Blocker Management

### When Blocker Identified
1. **Document in COORDINATION_HUB.md:**
   - Add to "Blockers & Risks" section
   - Identify owner
   - Document impact
   - Link to resolution doc (if exists)

2. **Update AGENT_STATUS_BOARD.md:**
   - Add blocker to affected agent's section
   - Update status to ⚠️ BLOCKED

3. **Create blocker doc (if needed):**
   - Location: `docs/blockers/`
   - Name: `BLOCKER_[TASK_ID]_[DESCRIPTION].md`

### When Blocker Resolved
1. **Update COORDINATION_HUB.md:**
   - Move to "Resolved Blockers" section
   - Update status

2. **Update AGENT_STATUS_BOARD.md:**
   - Remove blocker
   - Update agent status

3. **Archive blocker doc:**
   - Move to `docs/archive/blockers/` (if exists)

---

## ✅ Best Practices

### Keep It Clean
- ✅ **One active coordination doc per task**
- ✅ **Archive immediately when complete**
- ✅ **Update hub daily (or when status changes)**
- ✅ **Use templates for consistency**
- ✅ **Link related documents**

### Avoid Clutter
- ❌ **Don't keep completed tasks in active directory**
- ❌ **Don't duplicate information across docs**
- ❌ **Don't create multiple coordination docs for same task**
- ❌ **Don't leave old status information**

### Consistency
- ✅ **Always use templates**
- ✅ **Follow naming conventions**
- ✅ **Update both hub and board together**
- ✅ **Use consistent status indicators**

---

## 📚 Quick Reference

### Common Tasks
- **New task:** Copy template → Fill in → Update hub → Update board → Commit
- **Status change:** Update hub → Update board → Update task coordination doc → Commit
- **Review complete:** Update hub → Update board → Update review coordination doc → Commit
- **Task complete:** Archive coordination doc → Update hub → Update board → Commit

### Commit Schedule
- **See:** `COMMIT_SCHEDULE.md` for detailed commit workflow
- **Daily:** End of day commit
- **Real-time:** Commit on status changes
- **Weekly:** Summary commit

### Document Locations
- **Central Hub:** `docs/coordination/COORDINATION_HUB.md`
- **Agent Board:** `docs/coordination/AGENT_STATUS_BOARD.md`
- **Templates:** `docs/coordination/TEMPLATES/`
- **Active Coordination:** `docs/coordination/COORDINATION_*.md`
- **Completed Coordination:** `docs/archive/coordination-completed/`

---

**Created:** 2025-01-11  
**Purpose:** Maintain coordination system efficiently and consistently

