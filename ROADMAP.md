# Client Clock — v2 Ideas

Backlog for next iteration. Prioritized roughly top-to-bottom.

## Medium
- [ ] **Earnings rate in Settings** — a default hourly rate that feeds into an "earnings today" stat in the summary. Currently shows hours but not ₱/day earned.
- [ ] **Dark mode toggle** — already mostly supported via CSS variables, just needs a permanent toggle somewhere visible
- [ ] **Keyboard shortcuts** — `P` for pomodoro/free toggle, `Space` for start/pause, `D` for done, `S` for skip break, `Esc` to cancel. Small QoL.

## Low / Polish
- [ ] **Break auto-finish → "Ready" state** — when break timer naturally reaches 0, auto-transition to a "Ready for next work?" state instead of just sitting there
- [ ] **Session duration warning** — if the timer's been running >8 hours without a done, show a toast suggesting to wrap up
- [ ] **GCash QR placeholder** — replace `gcash-qr.jpg` with actual QR when donation page is ready
