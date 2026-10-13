# Ethiopian Equb — Expo TypeScript MVP

A mobile-first Equb management MVP with:
- Amharic / English UI toggle
- 40 fictional demo members
- Dashboard totals driven by the financial engine
- Local persistence on the device
- Member list, search, and add-member form
- Contribution records with pending / confirmed / rejected states
- Payout list and a guarded approval helper
- Unit tests for core collection and payment rules

## Important status

This is a **local MVP**, not a production financial service. Data is stored on the current device with AsyncStorage. There is no authentication, shared cloud database, real SMS/OTP, Telebirr integration, bank integration, or server-side authorization yet. Demo payments are not real transactions. Do not use it to manage real members' money until a secure backend and operational controls have been built and tested.

## Requirements

- Node.js LTS
- npm
- Android emulator, Android phone with Expo Go, or a browser for supported Expo web features

## Run on Ubuntu

```bash
unzip ethiopian-equb-app.zip
cd ethiopian-equb-app
npm install
npx expo start
```

Then:
- Press `a` to open Android emulator if Android Studio emulator is installed and running.
- Or scan the QR code with Expo Go on a compatible phone.
- For web, install the required web dependencies if Expo prompts you, then use `w`.

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

Pending contributions are excluded from confirmed totals. The sample payout is labelled as demo-only and must not be treated as a real approved transfer.

## Suggested next production milestones

1. Add backend API and database migrations.
2. Add authentication, roles, server-side authorization, and audit logs.
3. Move all financial calculations and verification decisions to the server.
4. Integrate a payment provider only after reviewing its official requirements and obtaining credentials.
5. Add backups, monitoring, reconciliation, privacy controls, and security testing.
6. Test with a small, consenting pilot group before production.
# ethiopian-equb
