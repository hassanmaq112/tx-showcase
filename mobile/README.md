# Expense Tracker — Mobile (React Native + Expo)

A native iOS/Android expense tracker: log expenses with receipt photos, see
category breakdowns and trends, set budgets with alerts. **Local-first** (works
fully offline) with an optional **Supabase** backend for accounts, cross-device
sync, and cloud receipt storage.

Built with **Expo SDK 56**, React Native, TypeScript, expo-router. Shares its
pure domain logic (types, store/reducer, analytics, dates, budgets) with the web
PWA in `../app`.

## Run it (no Mac required)

```bash
cd mobile
npm install
npx expo start
```

- **On your iPhone/Android:** install **Expo Go** from the App Store / Play Store,
  then scan the QR code printed in the terminal. The app loads on your device.
- **In a browser (quick look):** press `w`, or `npm run web`. Some native-only
  features (camera, pinch-zoom lightbox) are stubbed on web; it's for sanity only.

The app works immediately with **no backend** — data is stored on-device.

## Enable the cloud backend (optional)

See [`supabase/README.md`](./supabase/README.md). In short: create a Supabase
project, run `supabase/migrations/0001_init.sql`, then:

```bash
cp .env.example .env   # fill EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY
npx expo start -c
```

With keys set, the app shows a sign-in screen and syncs; without them it stays
local-only.

## Features
- Expense CRUD with category, date, notes, and receipt photo (camera or gallery,
  auto-compressed to ~200 KB)
- Dashboard: month/week/daily totals, global budget progress bar, day-grouped list
- Analytics: category donut + ranked breakdown, 12-month trend, month-over-month,
  per-category budgets
- Budgets: global + per-category limits with warn/over alerts
- Settings: currency, category manager (delete → reassign to "Other"), JSON/CSV
  export (share sheet), clear-all
- Light/dark following the system; safe-area aware; native tab bar with center Add
- Auth (email + password), local-first cloud sync (last-write-wins, offline queue,
  realtime), receipts in private Supabase Storage with local cache

## Standalone builds (EAS)

Expo Go is great for development, but for a real installable app (Android **APK**
or iOS **TestFlight/ad-hoc**) use **EAS Build** (cloud builds — no Mac needed).
`eas.json` defines the profiles.

One-time:
```bash
npm i -g eas-cli
eas login                 # your Expo account (free)
eas init                  # links the project, writes extra.eas.projectId into app.json
```

Build:
```bash
# Android APK you can sideload onto a phone:
eas build -p android --profile preview

# iOS build for your device / TestFlight (needs an Apple Developer account;
# EAS will guide you through credentials):
eas build -p ios --profile preview      # ad-hoc internal install
eas build -p ios --profile production    # App Store / TestFlight
eas submit -p ios --profile production   # upload to TestFlight
```

Profiles:
- **development** — dev client (`expo-dev-client`) for debugging with native modules
- **preview** — internal distribution; Android emits an installable `.apk`
- **production** — store builds with auto-incrementing build numbers

Remember to set `mobile/.env` (or EAS env vars / secrets) for Supabase before a
build if you want the cloud backend baked in.

## Project layout
```
mobile/
  src/app/            expo-router routes: (tabs) Home/Stats/Settings, add & edit modals, (auth) sign-in
  src/screens/        screen components
  src/components/     ui primitives, expense/budget/analytics/settings, layout, SyncManager
  src/store/          Context + useReducer store (ported from web)
  src/lib/            storage (AsyncStorage), receipts (file-system), compress, export,
                      analytics, dates, currency, supabase, sync, receiptsRemote
  src/theme/          StyleSheet design tokens (light/dark)
  supabase/           SQL migration + setup guide
```

## Scripts
- `npm run start` — Expo dev server (QR for Expo Go)
- `npm run web` — run in the browser
- `npm run lint` — Expo ESLint
- `npx tsc --noEmit` — typecheck
