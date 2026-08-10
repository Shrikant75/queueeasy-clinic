# QueueEasy Clinic — PWA Sample

A real, deployable Progressive Web App version of the clinic prototype — installable, works offline for the app shell, and (once wired to a real push backend) can receive notifications.

## Why this exists separately from the artifact prototype

Claude's artifact preview runs inside a sandboxed iframe, which blocks service worker registration and "Add to Home Screen" — so a true PWA can't be demonstrated live in chat. These are the actual source files; host them anywhere and it becomes a real installable PWA.

## What's different from the in-chat prototype

- **Storage**: uses the browser's real `localStorage` instead of the chat sandbox's storage API. It's synchronous and atomic per tab, so the version-numbering/retry logic built to work around the sandbox's quirks isn't needed here — genuinely simpler, more correct code.
- **Cross-tab sync**: uses the native `storage` event (fires only in *other* tabs when a write happens) instead of polling — no 3-second delay, no self-clobbering risk.
- **Icons**: kept dependency-free with emoji/text glyphs instead of an icon library, so there's nothing to install to run this. Swap in a real icon set (Lucide, Heroicons) for production.
- **Push notifications**: `sw.js` has a working `push` event handler (with the vibration-pattern bug from the original doc fixed), but nothing sends a push yet — that requires a backend with a Web Push/FCM integration, which is a real build task, not something this static demo can do.

## How to actually test it as an installable PWA

**The error `Job rejected for non app-bound domain`** means you're viewing this inside an embedded webview (e.g. an in-app file previewer) — iOS restricts service workers to a short allow-list of domains inside those. It's expected there and disappears once opened in a real browser tab. The app now shows an in-app banner explaining this automatically when it happens, instead of only logging to the console.

### With a computer (fastest)
```bash
npx serve .
# open the printed localhost URL on your phone (same wifi network), or in a real browser tab on the computer
```
Or deploy for free: drag this folder into netlify.com/drop, or `npx vercel deploy`.

### Phone-only, no computer needed
1. Go to **glitch.com** in Safari/Chrome (not an in-app browser) and create a new project.
2. Upload/paste in `index.html`, `manifest.json`, `sw.js`, and `icon.svg`.
3. Glitch gives you a live HTTPS URL immediately — open *that* URL in Safari/Chrome directly (not Glitch's own preview pane, which is itself an embedded webview and will show the same restriction).
4. You should now see a real "Add to Home Screen" prompt.

Once hosted over HTTPS and opened in an actual browser tab, you'll get a real install prompt, and it'll open full-screen without browser chrome, matching the `display: standalone` setting in `manifest.json`.

## Known gaps before this is production-ready

- **Icons**: only an SVG is provided. iOS wants a proper PNG `apple-touch-icon` (180×180) — SVG support there is inconsistent.
- **Single-device only**: `localStorage` doesn't sync across devices — a patient's phone and the clinic's staff tablet won't see each other's data with this storage layer as-is. Real deployment needs the Supabase backend from the technical solution doc; this local-storage version is for demonstrating PWA installability and offline behavior, not multi-device sync.
- **No real push yet**: the service worker can *receive* a push and show a notification, but nothing triggers one. That's the backend integration (Postgres trigger → Web Push/FCM) discussed for the real build.
- **Ideas from the original doc not included here**: geofencing/PIN verification and the midnight cron reset were flagged as good ideas worth pulling into the technical solution doc, but aren't built into this sample — happy to add either if useful.
