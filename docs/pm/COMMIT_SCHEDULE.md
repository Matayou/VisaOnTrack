# Commit Schedule — Coordination System Integration

**Purpose:** Regular commit schedule to maintain clean git history and track progress  
**Frequency:** Daily (or as needed)  
**Created:** 2025-01-11

---

## 🕐 Commit Schedule

### Daily Commits (End of Day)
- **Time:** End of workday (or before major break)
- **Purpose:** Commit all coordination updates and status changes
- **Message Format:** `[PM] Update coordination hub: [brief description]`

### On Status Changes (Real-time)
- **When:** Immediately after significant status changes
- **Purpose:** Track blocker resolutions, review completions, task assignments
- **Message Format:** `[PM] [Status]: [Task ID] - [Description]`

### Weekly Summary Commits
- **Time:** End of week (Friday)
- **Purpose:** Weekly milestone progress summary
- **Message Format:** `[PM] Weekly summary: [Milestone] - [X/Y tasks complete]`

---

## 📋 Commit Checklist

### Before Committing
- [ ] Update COORDINATION_HUB.md if status changed
- [ ] Update AGENT_STATUS_BOARD.md if agent status changed
- [ ] Update HUB_UPDATE_LOG.md with significant changes
- [ ] Verify all file paths are correct
- [ ] Check for any new coordination documents to add
- [ ] Archive completed tasks if any

### Commit Message Format
```
[PM] [Category]: [Brief Description]

[Optional detailed description]
- Change 1
- Change 2
- Change 3

Related: [Task ID or Issue]
```

### Categories
- `Update coordination hub` — Regular hub updates
- `Status` — Status changes (blockers, reviews, tasks)
- `Task assignment` — New task assignments
- `Blocker resolution` — Blocker resolved
- `Review complete` — Agent review completed
- `Archive` — Archive completed tasks
- `Weekly summary` — Weekly progress summary

---

## 📅 Daily Commit Workflow

### Morning Routine
1. **Check git status** — See what changed overnight
2. **Update coordination hub** — Refresh status from PROJECT_STATUS.md
3. **Commit if needed** — `[PM] Update coordination hub: Morning status refresh`

### During Day
1. **As status changes** — Commit immediately
   - Example: `[PM] Status: M1-BE-7 - Tech Lead review complete`
2. **As blockers resolve** — Commit resolution
   - Example: `[PM] Blocker resolution: M1-BE-7 setup complete`
3. **As tasks assigned** — Commit assignment
   - Example: `[PM] Task assignment: M1-FE-6 to Frontend Engineer`

### End of Day
1. **Final status check** — Ensure hub is current
2. **Commit all changes** — `[PM] Update coordination hub: End of day [Date]`
3. **Update HUB_UPDATE_LOG.md** — Document day's changes
4. **Commit log update** — `[PM] Update coordination hub: Log update`

---

## 📊 Commit Examples

### Regular Hub Update
```bash
git add docs/coordination/COORDINATION_HUB.md docs/coordination/AGENT_STATUS_BOARD.md
git commit -m "[PM] Update coordination hub: M1-BE-7 status update

- Tech Lead review complete
- Security Guard review complete
- Scope Guardian review complete
- Setup pending: .env file creation

Related: M1-BE-7"
```

### Status Change
```bash
git add docs/coordination/COORDINATION_HUB.md docs/coordination/AGENT_STATUS_BOARD.md
git commit -m "[PM] Status: M1-BE-7 - Tech Lead review complete

- Tech Lead: APPROVED WITH RECOMMENDATIONS
- Review document: docs/reviews/TECH_LEAD_REVIEW_M1_BE_7_AUTH_API.md
- Next: Security Guard review

Related: M1-BE-7"
```

### Blocker Resolution
```bash
git add docs/coordination/COORDINATION_HUB.md docs/blockers/
git commit -m "[PM] Blocker resolution: M1-BE-7 setup complete

- .env file created
- Database migration run
- Ready for test implementation

Related: M1-BE-7"
```

### Weekly Summary
```bash
git add docs/coordination/COORDINATION_HUB.md docs/coordination/HUB_UPDATE_LOG.md
git commit -m "[PM] Weekly summary: M1 - 7/9 tasks complete (78%)

Completed this week:
- M1-FE-5: Seeker Onboarding Welcome (complete)
- M1-BE-7: Authentication API (3/4 reviews complete)

In progress:
- M1-BE-7: Setup pending (.env file)

Blockers:
- 1 active blocker (M1-BE-7 setup)

Related: M1"
```

---

## 🔄 Integration with Coordination Hub

### Hub Update Log
Every commit should be reflected in `HUB_UPDATE_LOG.md`:
- Date and time of update
- What changed
- Why it changed
- Related task/issue

### Status Tracking
Commit schedule ensures:
- ✅ Git history reflects coordination updates
- ✅ Status changes are tracked
- ✅ Progress is visible in git log
- ✅ Coordination documents are versioned

---

## 📝 Best Practices

### Do Commit
- ✅ Daily coordination updates
- ✅ Status changes (reviews, blockers, tasks)
- ✅ New task assignments
- ✅ Blocker resolutions
- ✅ Weekly summaries

### Don't Commit
- ❌ Empty commits (no changes)
- ❌ Unrelated changes together
- ❌ Commit messages without context
- ❌ Skipping coordination updates

### Commit Message Quality
- ✅ Clear category
- ✅ Brief description
- ✅ Detailed description if needed
- ✅ Related task/issue reference
- ✅ Actionable information

---

## 🎯 Commit Frequency Goals

### Minimum
- **Daily:** 1 commit (end of day)
- **Weekly:** 7 commits (daily + summary)
- **Per status change:** Immediate commit

### Target
- **Daily:** 1-3 commits (regular updates + status changes)
- **Weekly:** 10-15 commits (active coordination)
- **Per status change:** Immediate commit

---

## 📚 Related Documents

- **Git Strategy:** `GIT_COMMIT_STRATEGY.md` (root)
- **Coordination Hub:** `docs/coordination/COORDINATION_HUB.md`
- **Hub Update Log:** `docs/coordination/HUB_UPDATE_LOG.md`
- **PM Guide:** `docs/pm/COORDINATION_SYSTEM_GUIDE.md`

---

**Created:** 2025-01-11  
**Purpose:** Maintain regular commits as part of coordination system

