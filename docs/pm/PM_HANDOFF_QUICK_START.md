# PM Quick Start Guide — VisaOnTrack v2

**Date:** 2025-01-11  
**For:** New PM  
**Purpose:** Quick reference to get started immediately

---

## 🚀 Quick Start Checklist

### 1. Read These Documents First (Priority Order)

1. **`PROJECT_STATUS.md`** — Current status, blockers, recent decisions
2. **`PM_HANDOFF_DOCUMENT.md`** — Complete handoff document (read this in full)
3. **`visaontrack-v2-spec.md`** — Specification (reference as needed)
4. **`MILESTONE_M1.md`** — Current milestone tasks

### 2. Understand Your Role

**You Are:** Project Manager (Coordinator)  
**You Do:** Assign tasks, coordinate agents, track progress, manage blockers  
**You DON'T:** Write code, implement features, create files (agents do that)

**Communication Model:**
- You coordinate in THIS chat
- User delivers your prompts to agents in THEIR separate chats
- User reports back agent results to you

### 3. Current Status (TL;DR)

**M0:** ✅ Complete  
**M1:** ⏳ In Progress (3/6 frontend tasks, 0/3 backend tasks)  
**Blockers:** ✅ None  
**Next Task:** M1-FE-4 (Account Type Selection) — ⏳ READY

### 4. Active Tasks

**Ready for Implementation:**
- ⏳ **M1-FE-4: Account Type Selection** — Frontend Engineer
  - Blocker resolved, all reviews approved
  - See: `COORDINATION_M1_FE_4_IMPLEMENTATION.md`

**Pending:**
- ⏳ M1-FE-5: Seeker Onboarding Welcome
- ⏳ M1-FE-6: Provider Onboarding (5 steps)
- ⏳ M1-BE-7: Authentication API Endpoints
- ⏳ M1-BE-8: User Management API Endpoints (partial: OpenAPI spec done, implementation pending)
- ⏳ M1-BE-9: Provider Onboarding API Endpoints

---

## 📋 Your First Actions

### Immediate (Today)

1. **Read `PM_HANDOFF_DOCUMENT.md`** — Complete context
2. **Read `PROJECT_STATUS.md`** — Current status
3. **Verify Current Task Status** — Check M1-FE-4 is ready

### Next (This Week)

1. **Coordinate M1-FE-4 Implementation**
   - Frontend Engineer can proceed (blocker resolved)
   - See: `COORDINATION_M1_FE_4_IMPLEMENTATION.md`

2. **Assign Backend Tasks**
   - M1-BE-8: Implement `PATCH /users/me` endpoint (backend)
   - M1-BE-7: Implement `POST /auth/register` endpoint

3. **Track Progress**
   - Update `PROJECT_STATUS.md` after completions
   - Git commit regularly

---

## 🔑 Key Principles

1. **Spec is Truth** — `visaontrack-v2-spec.md` is the single source of truth
2. **MVP Focus** — No scope creep without RFC
3. **Multi-Agent Reviews** — All critical tasks require reviews
4. **PM Coordinates, Agents Code** — You don't write code
5. **Scope Guardian is REVIEW ONLY** — Does NOT write code

---

## 📞 Agent Coordination

### How to Assign a Task

1. Create task document (`TASK_[TASK].md`)
2. Create coordination document (`COORDINATION_[TASK].md`)
3. Provide prompt to user to deliver to agent

**Example Prompt:**
```
[Agent Name]: Please [task description].

Task Document: [TASK_FILE.md]
[Key requirements]

Status: [STATUS]
```

### How to Coordinate Review

1. Create `COORDINATION_[TASK]_REVIEW.md`
2. Provide review prompts to user
3. User delivers to agents in sequence
4. Update coordination document with results

---

## 🎯 Success Metrics

**Track:**
- Tasks completed on time
- Blockers resolved quickly
- Reviews completed efficiently
- Documentation up to date

**Indicators:**
- All tasks pass multi-agent review
- Scope Guardian approves all tasks
- No scope creep
- Regular Git commits

---

## ⚠️ Common Pitfalls to Avoid

1. **Don't Write Code** — Assign to agents
2. **Don't Let Scope Guardian Implement** — They review only
3. **Don't Skip Reviews** — Multi-agent review required
4. **Don't Deviate from Spec** — Use RFC process
5. **Don't Forget Git Commits** — Commit regularly

---

## 📚 Essential Documents

**Status:**
- `PROJECT_STATUS.md` — Current status
- `MILESTONE_M1.md` — Current milestone

**Spec:**
- `visaontrack-v2-spec.md` — Complete specification

**Process:**
- `CONTRIBUTING.md` — DoR/DoD, RFC template
- `PM_HANDOFF_DOCUMENT.md` — Complete handoff

**Tasks:**
- `TASK_M1_FE_*.md` — Frontend tasks
- `TASK_M1_BE_*.md` — Backend tasks

---

## 🚦 Current Traffic Light Status

🟢 **Green (Go):**
- M1-FE-4 implementation (blocker resolved)
- Backend API implementations (can proceed)

🟡 **Yellow (Caution):**
- None currently

🔴 **Red (Stop):**
- None currently

---

## 💡 Pro Tips

1. **Always Check `PROJECT_STATUS.md` First** — It's your primary status document
2. **Use Multi-Agent Reviews** — Quality gate for all critical tasks
3. **Document Everything** — Status updates, reviews, blockers
4. **Git Commit Regularly** — After completions, reviews, blockers
5. **Trust the Process** — Multi-agent review works

---

## 🎓 Learning Resources

**Read These to Understand Context:**
- `PM_HANDOFF_DOCUMENT.md` — Complete handoff (read this!)
- `PROJECT_STATUS.md` — Current status
- `CONTRIBUTING.md` — Processes and workflows
- `docs/ARCHITECTURE.md` — Architecture overview

**Reference These Regularly:**
- `visaontrack-v2-spec.md` — Specification
- `MILESTONE_M1.md` — Current milestone tasks

---

## ✨ You're Ready!

**Everything you need is documented. Start with:**
1. Read `PM_HANDOFF_DOCUMENT.md` (complete context)
2. Check `PROJECT_STATUS.md` (current status)
3. Coordinate M1-FE-4 implementation (next task)

**Welcome to the team! 🚀**

---

**Created:** 2025-01-11  
**For:** New PM  
**Status:** ✅ **READY FOR NEW PM**

