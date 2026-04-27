# Pet Care Tracker

Local-first cross-platform pet health and care tracking built with Expo, React Native, TypeScript, Expo Router, and React Native Web.

## Features

- Multiple pet profiles with vet info, microchip, notes, and photo placeholder
- Dashboard with upcoming care items, recent activity, and quick actions
- Health logs for symptoms, mood, energy, stool/urine notes, injuries, and observations
- Feeding logs for meals, treats, supplements, quantities, and water intake
- Medication schedules with dose tracking
- Appointments and reminders with upcoming and past views
- Weight tracking with latest value surfaced on profiles
- Manual record entries for vaccines and important health records
- Local JSON export/import and demo data reset

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

## Run In The Browser

```bash
npm run web
```

Then open the local Expo web URL shown in the terminal, usually `http://localhost:8081`.

## Run With Expo Go On iPhone

```bash
npx expo start
```

1. Install `Expo Go` from the iPhone App Store.
2. Make sure the iPhone and this computer are on the same Wi-Fi network.
3. Start the Expo dev server with `npx expo start`.
4. In the terminal or Expo Dev Tools, show the QR code.
5. Open the iPhone camera and scan the QR code, or open Expo Go and scan it there.
6. The project will open directly in Expo Go without a full App Store install.

## Notes

- Data is stored locally on the device or browser using AsyncStorage.
- Export/import uses JSON backups.
- File uploads and cloud sync are intentionally out of scope for v1.
