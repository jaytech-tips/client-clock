# Bilang — Bug Tracker & Improvements

Known issues and UX improvements to fix in the next batch.

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

---

## Suggestions button needs a label

**Severity:** Low
**Affects:** v2.1.0+
**Reason:** The 💬 button just shows an icon with no text — users don't know it's for suggestions.

**Fix:** Change the button from `<button class="icon-btn" ... title="Suggestions">💬</button>` to include text label. Could add inline text next to icon or a small label below.

---

## Show suggestions prompt after tutorial

**Severity:** Low
**Affects:** v2.1.0+
**Reason:** After the tutorial closes, users should be pointed to the suggestions button if they have feedback.

**Fix:** In `closeTutorial()`, show a toast: "Got feedback? Click the 💬 button!" or similar. Could also use the warning banner area.

---

## Remove duration/rate editing from session modal

**Severity:** Medium
**Affects:** v2.1.0+
**Reason:** Editing time lets people cheat their clients. Bilang should be an honest time tracker.

**Fix:** Remove the Duration and Hourly Rate fields from the edit modal. Only allow editing Client, Date, Status, and Notes. Display duration/rate as read-only in the modal.

---

## Dark mode persistence

**Status:** ✅ Already implemented
`toggleDark()` saves to localStorage via `sv()`, `applyDark()` restores on page load. If it's not working on your end, let me know.

---

## GCash QR image is missing (404)

**Severity:** Low
**Affects:** v2.1.0+
**Reason:** `gcash-qr.jpg` was never committed to the repo. Since the repo was renamed, the old URL broke and now shows 404. Even before rename, it never loaded.

**Fix:** Either (a) remove the image until the real QR is ready, replacing with a placeholder text, or (b) add the actual QR image to the repo.
