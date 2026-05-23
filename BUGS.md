# Bilang — Bug Tracker

Known issues to fix in the next batch.

## Remove duration/rate editing from session modal

**Severity:** Medium
**Affects:** v2.1.0+
**Reason:** Editing time lets people cheat their clients. Bilang should be an honest time tracker.

**Fix:** Remove the Duration and Hourly Rate fields from the edit modal. Only allow editing Client, Date, Status, and Notes. Display duration/rate as read-only in the modal.

---

## Unfinished session resume — wrong duration on Done

**Severity:** Medium
**Affects:** v2.1.0+

**Description:** When you close the tab mid-session, come back, click Resume from the banner, then click Done, the recorded duration is only the time *since* resuming — not the total including the original session.

**Root cause:** `doneTimer()` and `stopTimer()` calculate elapsed time as:
```js
elapsedSec = ts.running ? (now - ts.startTime) / 1000 : ts.elapsed;
```
This is missing `+ ts.elapsed`. Compare with `updateDisplay()` which correctly does:
```js
elapsed = ts.running ? (now - ts.startTime) / 1000 + ts.elapsed : ts.elapsed;
```

**Fix:** In `doneTimer()` and `stopTimer()`, change:
```js
elapsedSec = ts.running ? (now - ts.startTime) / 1000 : ts.elapsed;
```
to:
```js
elapsedSec = ts.running ? (now - ts.startTime) / 1000 + ts.elapsed : ts.elapsed;
```

**Test:** Start timer → close tab → reopen → resume → wait 30s → Done → check session duration shows total time, not just the 30s.
