# Commit Checklist — Quick Reference

**Purpose:** Quick checklist before committing coordination updates  
**Use:** Before every coordination-related commit

---

## ✅ Pre-Commit Checklist

### Documentation Updates
- [ ] COORDINATION_HUB.md updated (if status changed)
- [ ] AGENT_STATUS_BOARD.md updated (if agent status changed)
- [ ] HUB_UPDATE_LOG.md updated (if significant change)
- [ ] Task coordination docs updated (if task status changed)
- [ ] Review coordination docs updated (if review completed)

### File Organization
- [ ] Completed tasks moved to archive (if any)
- [ ] New coordination docs created (if new task)
- [ ] File paths verified (no broken links)

### Status Accuracy
- [ ] Current status matches PROJECT_STATUS.md
- [ ] Agent statuses accurate
- [ ] Blockers documented correctly
- [ ] Action items clear and assigned

---

## 📝 Commit Message Template

```bash
[PM] [Category]: [Brief Description]

[Optional: Detailed description]
- Change 1
- Change 2

Related: [Task ID or Issue]
```

### Categories
- `Update coordination hub` — Regular updates
- `Status` — Status changes
- `Task assignment` — New assignments
- `Blocker resolution` — Resolved blockers
- `Review complete` — Completed reviews
- `Archive` — Archived tasks
- `Weekly summary` — Weekly summaries

---

## 🚀 Quick Commit Commands

### Daily Update
```bash
git add docs/coordination/COORDINATION_HUB.md docs/coordination/AGENT_STATUS_BOARD.md
git commit -m "[PM] Update coordination hub: [Date]"
```

### Status Change
```bash
git add docs/coordination/ docs/reviews/ docs/blockers/
git commit -m "[PM] Status: [Task ID] - [Description]"
```

### Multiple Changes
```bash
git add docs/coordination/ docs/reviews/ docs/blockers/ docs/setup/
git commit -m "[PM] Update coordination hub: Multiple updates

- Status change 1
- Status change 2
- Blocker resolution
- Review complete"
```

---

**Created:** 2025-01-11  
**Purpose:** Quick reference for coordination commits

