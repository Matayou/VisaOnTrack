# Context Management System — Preventing Information Loss

**Purpose:** Prevent context loss across long conversations and multiple agent instances  
**Created:** 2025-01-11  
**Status:** ✅ Active

---

## 🎯 Problem Statement

**Risk:** Context window limits can cause:
- Loss of important decisions and status updates
- Duplicate work or missed coordination
- Inability to track what was discussed in previous chats
- Confusion when resuming after long breaks

**Solution:** Document everything important in the coordination system, not just in chat.

---

## ✅ Current System Robustness

### What's Already Robust ✅

1. **COORDINATION_HUB.md** — Single source of truth
   - ✅ All current status tracked
   - ✅ All action items documented
   - ✅ All blockers identified
   - ✅ Updated regularly

2. **AGENT_STATUS_BOARD.md** — Agent-specific tracking
   - ✅ Each agent's status tracked
   - ✅ Action items per agent
   - ✅ Recent completions logged

3. **HUB_UPDATE_LOG.md** — Audit trail
   - ✅ All updates logged
   - ✅ Git commits tracked
   - ✅ Historical reference

4. **Commit Schedule** — Git history
   - ✅ All coordination updates committed
   - ✅ Status changes tracked in git
   - ✅ Historical reference available

### What Needs Enhancement ⚠️

1. **Chat Context Management** — No system for archiving chat context
2. **Resume Guides** — No quick resume for agents after long breaks
3. **Context Snapshots** — No periodic snapshot system
4. **Chat Boundaries** — No clear guidelines for when to start new chats

---

## 🔧 Enhanced Context Management

### 1. Context Snapshot System

**Create periodic snapshots** of important decisions and status:

**Location:** `docs/coordination/context-snapshots/`

**When to Create:**
- Weekly (every Friday)
- After major milestone completions
- After significant decisions
- Before starting new major work

**What to Include:**
- Current status summary
- Key decisions made
- Blockers and resolutions
- Agent assignments
- Next actions

### 2. Chat Archival Guidelines

**When to Archive Chat:**
- Context window approaching limit (80% full)
- Major task completion
- Weekly summary
- Switching to new major topic

**How to Archive:**
1. Create context snapshot before archiving
2. Document key decisions in coordination hub
3. Commit all important information
4. Note in hub: "Chat archived, context snapshot created"

### 3. Resume Guides

**For Agents Resuming Work:**
- Check COORDINATION_HUB.md first
- Check AGENT_STATUS_BOARD.md for your status
- Check latest context snapshot if long break
- Review recent commits for changes

**For PM Resuming:**
- Check COORDINATION_HUB.md
- Review PM_DAILY_CHECK documents
- Check HUB_UPDATE_LOG.md for recent changes
- Review git log for commits

### 4. Chat Boundaries

**Start New Chat When:**
- Context window > 80% full
- Major topic change (new milestone)
- Switching to different agent assignment
- After completing major task

**Continue Existing Chat When:**
- Same topic/agent
- Context window < 50% full
- Related work continuing

---

## 📋 Context Management Checklist

### Before Chat Gets Full (80% Full)
- [ ] Create context snapshot
- [ ] Document all important decisions in coordination hub
- [ ] Update agent status board
- [ ] Commit all changes
- [ ] Create resume guide for next session

### When Starting New Chat
- [ ] Read COORDINATION_HUB.md
- [ ] Read AGENT_STATUS_BOARD.md
- [ ] Read latest context snapshot (if available)
- [ ] Review recent git commits
- [ ] Acknowledge current status in new chat

### Weekly Context Maintenance
- [ ] Create weekly context snapshot
- [ ] Archive completed coordination docs
- [ ] Update coordination hub with weekly summary
- [ ] Commit context snapshot

---

## 🔄 Context Snapshot Template

**File:** `docs/coordination/context-snapshots/CONTEXT_SNAPSHOT_YYYY-MM-DD.md`

**Contents:**
- Current status summary
- Active tasks and assignments
- Blockers and resolutions
- Key decisions made
- Agent statuses
- Next actions
- Git commit references

---

**Created:** 2025-01-11  
**Purpose:** Prevent context loss across long conversations

