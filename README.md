# Pet Care Tracker

Local-first cross-platform pet health and care tracking built with Expo, React Native, TypeScript, Expo Router, and React Native Web.

## Current Features

- Multi-pet profiles with:
  - profile photo via local URI picker
  - vet info, clinic preferences, emergency contact, insurance, food, allergies, and known conditions
- Dashboard with:
  - pet care score cards
  - health alerts
  - upcoming due items
  - recent combined activity
  - quick actions
- Unified timeline across:
  - health logs
  - feeding logs
  - medication dose history
  - appointments and reminders
  - weight logs
  - general records
  - vaccines
- Medication tracking with:
  - once daily
  - twice daily
  - every X hours
  - weekly
  - custom schedule notes
  - dose history with given/skipped status
- Upcoming care screen grouped into:
  - Today
  - This week
  - Later
  - Past
- Separate vaccine tracking with current, expiring soon, and expired states
- Search and filtering for logs and records
- Local JSON backup export/import with validation and confirmation before replace
- Demo seed data and reset controls

## Project Structure

```text
app/
src/components/
src/features/
src/storage/
src/types/
src/utils/
src/data/
```

## Setup

```bash
npm install
```

## Run On The Web

```bash
npm run web
```

Then open the local Expo web URL shown in the terminal, usually `http://localhost:8081`.

## Test On iPhone With Expo Go

```bash
npx expo start
```

1. Install `Expo Go` on the iPhone.
2. Make sure the iPhone and this computer are on the same Wi-Fi network.
3. Run `npx expo start`.
4. Wait for the Expo Dev Tools or terminal QR code.
5. Open the iPhone camera or the Expo Go scanner and scan the QR code.
6. The app opens directly in Expo Go without an App Store build.

## Data Backup And Import

1. Open the `Settings` tab.
2. Tap `Export JSON` to download or share a full local backup.
3. Tap `Import JSON` and choose a previously exported backup.
4. Confirm the replacement prompt before the app overwrites current local data.
5. Use `Reload demo data` or `Clear all data` from the same screen when testing.

## Validation

```bash
npm run typecheck
npx expo export --platform web
```

## Known Limitations

- Data is stored locally with AsyncStorage only. There is no sync between devices yet.
- Profile photos are stored as local URIs. If a backup is restored on a different device, the image file behind that URI may not exist there.
- Date/time entry is text-based for compatibility and simplicity, not a native picker yet.
- Reminders are shown in-app only. There are no push notifications or background alerts yet.
- Records are metadata-only in this phase. File uploads are still out of scope.

## Phase 2 Roadmap

1. Add native/web date pickers and better recurring reminder editing.
2. Add optional file attachments for records and vet paperwork.
3. Add charts for weight and long-term symptom trends.
4. Add local notifications and background reminder scheduling.
5. Add optional cloud sync and household sharing.
