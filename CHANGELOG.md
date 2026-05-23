# Client Clock — Changelog

All notable changes to Client Clock, tracked from initial build.

---

## v1.2.0 — May 23, 2026

### Added
- **Tab title timer** — browser tab now shows remaining time (`25:00 - Client Clock`) so you know time left even when minimized
- **Desktop notifications** — requested on first Start click. Fires system `Notification` popups for work complete, break over, and break ended. Works even when tab is in the background
- **Unfinished session recovery** — if you close the tab mid-session, a yellow banner appears on reload: "Unfinished session for Client A (12m) — started at 2:34 PM". Resume restarts the timer, Cancel saves as cancelled, ✖ dismisses
- **Live notes input** — a text field appears under the timer when you start: "What are you working on?". Notes are saved to the session on Done, Cancel, or Pomodoro auto-stop. Field hides automatically when timer stops

### Changed
- `stopTimer()` now reads the live notes field and saves it to cancelled sessions
- `doneTimer()` (free mode) and Pomodoro auto-stop now capture notes from the live input
- `clearTimer()` hides the notes field and clears the input

### Fixed
- `skipBreak()` now calls `clearTimer()` instead of manually nulling `ts` (ensures notes field cleanup)

---

## v1.1.0 — May 23, 2026

### Added
- **Status tracking on sessions** — each session now has a `status` field: `completed` or `cancelled`
- **Cancel saves data** — pressing ✕ Cancel no longer discards your time. It saves the session with status "Cancelled" and the actual elapsed duration (≥5s threshold)
- **Edit session status** — the edit modal now has a Status dropdown (✅ Completed / ✕ Cancelled) so you can retroactively mark a cancelled session as billable
- **Skip button during break** — ⏭ instantly ends the break and goes back to ready state
- **+5m button during break** — adds 5 more minutes to the current break

### Changed
- **Break Done ends properly** — pressing ✅ Done during break now *ends* the break (doesn't restart it), shows "Break done — start next work session when ready"
- **Stats exclude cancelled** — total clients, hours, and earnings only count `status !== 'cancelled'`
- **Summary (weekly/monthly)** — excludes cancelled sessions from earnings and hours
- **Cancelled sessions appear faded** — `.opacity: .55` with a ✕ Cancelled badge next to the meta
- **CSV export** — added Status column to the export
- **✅ Done button** — only shows during work mode, hidden during break

---

## v1.0.0 — May 23, 2026

### Initial Release
*First deploy to GitHub Pages (jaytech-tips.github.io/client-clock)*

### Features
- **Two timer modes**: ⏱ Free Timer (track any duration) and 🍅 Pomodoro (25-min work / 5-min break / 15-min long break)
- **Client management**: type client name + hourly rate, or use quick-start presets
- **Live earnings display**: shows `💰 $X.XX earned so far` while timer runs
- **Timer controls**: ▶ Start, ⏸ Pause, ✅ Done, ✕ Cancel
- **Pomodoro auto-stop**: optional — when work session ends, auto-logs and starts break
- **Pomodoro progress bar**: visual fill for work/break countdown
- **Sound alerts**: triple beep on timer completion (work/break)
- **Dark mode toggle**: 🌙/☀️ in header
- **Session history**: Today / All Sessions tabs. Click client name to filter
- **Edit sessions**: ✏️ button to change client, date, duration, rate, notes
- **Delete sessions**: 🗑 with confirmation
- **Earnings summary**: 📊 modal — This Week / This Month earnings + breakdown by client
- **Client presets**: quick-start buttons configurable in Settings
- **Export / Import**: CSV export, JSON backup, JSON import (merge or replace)
- **Clear all data**: with double confirmation
- **GCash donation**: QR code in Support modal
- **Feedback form**: embedded Google Form
- **Keyboard shortcut**: Enter on client input starts the timer
- **Persistent state**: timer and session data survive page refresh via localStorage
- **Warning banner**: reminds users to export backups before clearing cache
- **Tutorial modal**: step-by-step guide on first visit
- **Responsive**: works on mobile down to 320px width

### Technical
- Single-file HTML (no dependencies, no build step)
- localStorage for all data (sessions, clientRates, presets, settings, timer state)
- CSS custom properties for theming (light/dark)
- Web Audio API for sound effects
- Session timer restored on page load via `ldt()` (timer state in localStorage)
- ~55KB gzipped, loads instantly
