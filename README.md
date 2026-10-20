# Ethiopian Equb — Expo TypeScript MVP

A mobile-first Equb management MVP with:

- Amharic / English UI toggle
- **Dark / light theme** — a header toggler plus Light / Dark / System in Settings, persisted on device
- 40 fictional demo members
- **No-repeat lottery rotation** — draw one winner per monthly cycle, exclude previous winners until all active members have won, and retain a searchable draw history
- Member records include a unique customer number and ID number; phone is optional. Older local records can be edited, and drawing is blocked until active members’ identities are completed
- Dashboard totals driven by the financial engine
- Local persistence on the device (Zustand + AsyncStorage)
- Member list, search by name/customer number/ID/phone, and add-member form
- Contribution records with pending / confirmed / rejected states
- Payout list and a guarded approval helper (lottery results do not authorize or move funds)
- Unit tests for collection/payment rules, draw fairness, cycle progression, and rotation reset

## Architecture

File-based routing with **Expo Router**, global state with **Zustand**, and a
token-based theme system. Routes are thin files that re-export feature screens,
so navigation structure and feature code scale independently.

```
app/                          # Expo Router routes (thin re-exports only)
  _layout.tsx                 # Root stack: hydration gate, theme-aware chrome
  index.tsx                   # "/" -> redirects to the (tabs) group
  (tabs)/
    _layout.tsx               # Tab bar (Dashboard, Members, Draw, Payments, Payouts, Settings)
    index.tsx                 # Dashboard tab
    members.tsx  draw.tsx  payments.tsx  payouts.tsx  settings.tsx
  add-member.tsx              # Modal route
  edit-member.tsx             # Modal route for completing/correcting member identity
  record-payment.tsx          # Modal route

src/
  core/
    engine/                   # Pure financial domain: types, rules, demo seed, tests
    i18n/                     # Amharic / English translations + useTranslation hook
  store/                      # Zustand stores + derived selectors
    useEqubStore.ts           # Equb data + actions, persisted to AsyncStorage
    useSettingsStore.ts       # Language + theme mode (light | dark | system), persisted
    selectors.ts              # Active cycle, cycle metrics, member lookups
  theme/                      # Light/dark color palettes, spacing/radius tokens, useTheme
  components/
    ui/                       # Screen, Card, MetricCard, AppButton, AppTextInput,
                              # StatusBadge, ProgressBar, SegmentedControl, Notice, ThemeToggle
    layout/                   # AppHeader (brand + theme toggler), DemoBanner
  features/                   # One folder per feature: screens/ + components/ + index.ts
    dashboard/  members/  draw/  payments/  payouts/  settings/
  hooks/
    useStoreHydration.ts      # Gates the UI until both stores rehydrate
```

Imports use the `@/*` alias for `src/*` (tsconfig `paths`, resolved by Metro).

### State & persistence notes

- `useEqubStore` persists under the **same AsyncStorage key and raw JSON shape**
  (`ethiopian-equb-state-v1`) the previous single-file app used, via a small
  storage adapter — existing installs keep their data across the refactor.
- Legacy data is normalized on read: draw history/rotation defaults are added and older cycles receive a one-time best-effort roster snapshot from members active at migration time. Since prior versions did not save historical rosters, exact past membership cannot be reconstructed. The app never invents real customer or ID numbers; complete missing values in Members before drawing.
- New cycles snapshot their participants. Adding a member updates the still-active cycle roster, but later membership changes do not alter completed-cycle collection targets.
- `useSettingsStore` persists under `ethiopian-equb-settings-v1`.
- Theme resolution: Settings stores `light | dark | system`; `useTheme()`
  resolves `system` against the OS color scheme and returns the active palette.
  The header `ThemeToggle` flips the resolved theme to an explicit mode.
- The engine in `src/core/engine` stays pure and framework-free: stores call
  it, screens never mutate state directly.

## Important status

This is a **local MVP**, not a production financial service. Data is stored on the current device with AsyncStorage. There is no authentication, shared cloud database, real SMS/OTP, Telebirr integration, bank integration, or server-side authorization yet. Demo payments are not real transactions. Do not use it to manage real members' money until a secure backend and operational controls have been built and tested.

## Requirements

- Node.js LTS
- npm
- Android emulator, Android phone with Expo Go, or a browser for supported Expo web features

## Run

```bash
git clone https://github.com/yoh-space/ethiopian-equb.git
cd ethiopian-equb
npm install
npx expo start
```

Then:

- Press `a` to open Android emulator if Android Studio emulator is installed and running.
- Or scan the QR code with Expo Go on a compatible phone.
- For web, press `w` (react-native-web + react-dom are installed).

## Test the financial engine

```bash
npm run test:engine
```

## Check TypeScript

```bash
npm run typecheck
```

## Demo calculations

40 active members × 5,000 ETB = 200,000 ETB expected.
8 confirmed payments × 5,000 ETB = 40,000 ETB confirmed.
Outstanding = 160,000 ETB.
Collection progress = 20%.

Pending contributions are excluded from confirmed totals. The initial demo state has no draw winner or payout; drawing a winner does not authorize or move funds.

## Suggested next production milestones

1. Add backend API and database migrations.
2. Add authentication, roles, server-side authorization, and audit logs.
3. Move all financial calculations and verification decisions to the server.
4. Integrate a payment provider only after reviewing its official requirements and obtaining credentials.
5. Add backups, monitoring, reconciliation, privacy controls, and security testing.
6. Test with a small, consenting pilot group before production.
