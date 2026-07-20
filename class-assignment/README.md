# Smart Field Survey & Inspection App 📱📊

[![Expo](https://img.shields.io/badge/Expo-v54.0.0-blue.svg?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61dafb.svg?style=flat-square&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey.svg?style=flat-square)]()
[![License](https://img.shields.io/badge/License-Academic-green.svg?style=flat-square)]()

A robust, modern **React Native** application built with the **Expo SDK 54** framework. This application is designed for field engineers and inspectors to conduct site surveys, capture geographical data, log contacts, take real-time photos, manage clipboard interactions, and persist history locally.

The project features a sleek, premium UI/UX, responsive styling supporting dark/light mode configurations, and an integrated **GPS/Hardware Simulator** for developer testing.

---

## 👨‍🎓 Student & Project Metadata

*   **Student Name:** Jalak Palan
*   **Student Email:** `jalak.palan@student.edu`
*   **Roll Number:** `RN-2026-07`
*   **Course:** React Native Mini Project Assignment
*   **Core Target:** 100% compliance with Modules 1 through 8.

---

## 🚀 Key Architectural Features & Highlighted Work

### 🛠️ Hardware Simulation Mode (Developer Toggle)
Field apps rely heavily on physical device permissions (Camera, Location, Contacts). To ensure **seamless testing on standard web browsers or Android/iOS Simulators**, we implemented a comprehensive **Simulated Data Mode**:
*   Can be toggled instantly from the **Settings** screen.
*   **Camera:** Displays a virtual viewfinder showing a mock field image (`simulated_site.png`) with live capture timestamp.
*   **GPS/Location:** Generates simulated coordinate locking centered around New Delhi, India, with localized accuracy margins (+/- 3m).
*   **Contacts:** Loads a local mock telephone directory, supporting search, contact initials, avatars, and pull-to-refresh.

### 💾 Robust Async Persistence
All completed surveys are stored locally on the device's sandboxed filesystem using `@react-native-async-storage/async-storage`. Submitted survey items persist across restarts, and a specialized **Database Utility** in settings allows clearing the DB for testing.

### 🗺️ Sophisticated Navigation Layout
Uses **Expo Router** to construct a dual-tier navigation system:
1.  **Drawer Navigation:** Root navigation providing easy access to all standalone features:
    `Dashboard` ➔ `Survey` ➔ `Camera` ➔ `Contacts` ➔ `Location` ➔ `Clipboard` ➔ `Settings`
2.  **Bottom Tabs Navigation:** Quick tab access to core user paths:
    `Dashboard` ➔ `New Survey` ➔ `History` ➔ `Profile`

---

## 📦 Application Modules Walkthrough

### 🏠 Module 1 — Dashboard (`app/(tabs)/index.tsx`)
*   **Dynamic Welcome:** Greeting card customized for Jalak Palan.
*   **Today's Progress:** Active survey counter showing completed logs for the current calendar day.
*   **Quick Actions:** Visual grid of pressable cards to hop directly to modules (Camera, GPS, Clipboard, Contacts, etc.).
*   **Activity Feed:** Scrollable view presenting high-level summaries of recent surveys.

### 📝 Module 2 — Create Survey (`app/(tabs)/survey.tsx`)
*   **Data Fields:** Site Name, Client Name, Description, Priority selection (`Low`, `Medium`, `High`), and Date.
*   **Field Validation:** Enforces non-empty values for required metadata (Site & Client name) prior to staging.
*   **Interactive Linking:** Displays badges when location coordinates, contacts, or photos are linked to the draft.

### 📸 Module 3 — Camera Interface (`app/(drawer)/camera.tsx`)
*   **Sensor Authorization:** Dynamically requests permissions.
*   **Image Pipeline:** Capture, full screen viewport preview, and capture timestamp overlay.
*   **Safe Execution:** Prompt confirmations before image removal. Offers fallback image injection in simulator mode.

### 📍 Module 4 — Location & GPS (`app/(drawer)/location.tsx`)
*   **GPS Fix:** Pings system location services.
*   **Accuracy Gauge:** Renders numerical estimation of coordinate resolution (+/- meters).
*   **Survey Linkage:** Attach coordinates straight to the active survey draft with one-tap clipboard backup.

### 👥 Module 5 — Contacts Directory (`app/(drawer)/contacts.tsx`)
*   **Directory Pull:** Fetches list of registered phone contacts.
*   **Search and Filter:** Real-time query search matching names or numbers.
*   **Pull to Refresh:** Integrates native `RefreshControl` to reload list.
*   **Initials Generator:** Automatically generates dynamic color-coded initial avatars.

### 📋 Module 6 — Clipboard Hub (`app/(drawer)/clipboard.tsx`)
*   **Inspector Notebook:** Real-time text-area to write notes, copy details, paste text, or wipe clipboard buffer.
*   **Data Aggregation:** One-click clipboard imports for Location Coordinates, Survey IDs, and Contact numbers.

### 🔍 Module 7 — Survey Preview & Submit (`app/survey-preview.tsx`)
*   **Inspection Sheet:** Consolidates site name, client, attached photo, geo-location coordinates, contact person, and notes on a single screen.
*   **Live Edits:** Tweak details before finalizing.
*   **Submission Log:** Permanently records survey into AsyncStorage with submission timestamp.

### 📜 Module 8 — Survey History (`app/(tabs)/history.tsx` & `survey-detail.tsx`)
*   **Survey Ledger:** Lists records using performance-optimized `FlatList`.
*   **Filter & Search:** Filter by priority levels or execute text search over site/client records.
*   **Survey Details view:** Expandable view detailing all logged parameters.
*   **Deletion Manager:** Destructive actions guarded by standard warning confirmation alerts.

---

## 🛠️ Tech Stack & Dependencies

*   **Framework:** [Expo SDK 54.0.35](https://docs.expo.dev/versions/v54.0.0/)
*   **Runtime:** React Native 0.81.5 (with New Architecture support)
*   **Routing:** Expo Router v6.0.24 (file-based navigation, typed routes)
*   **Navigation Hooks:** `@react-navigation/native`, `@react-navigation/drawer`, `@react-navigation/bottom-tabs`
*   **Storage:** `@react-native-async-storage/async-storage` (local state persistence)
*   **Sensor Packages:**
    *   `expo-camera` (Photo acquisition)
    *   `expo-location` (GPS coordinates tracking)
    *   `expo-contacts` (System address book query)
    *   `expo-clipboard` (System copy-paste API integration)
*   **Visual Assets:** `@expo/vector-icons` (Ionicons) and `react-native-reanimated` for smooth micro-animations.

---

## 📂 Project Directory Structure

```text
class-assignment/
├── app/                         # Expo Router App Directory
│   ├── (drawer)/                # Drawer navigation routes
│   │   ├── (tabs)/              # Nested Bottom tabs navigation
│   │   │   ├── _layout.tsx      # Bottom Tab Configuration
│   │   │   ├── history.tsx      # Survey Ledger Screen (Module 8)
│   │   │   ├── index.tsx        # Inspector Dashboard (Module 1)
│   │   │   ├── profile.tsx      # Student Profile Details
│   │   │   └── survey.tsx       # Survey Form Creator (Module 2)
│   │   ├── _layout.tsx          # Drawer Layout Configuration
│   │   ├── camera.tsx           # Camera Module (Module 3)
│   │   ├── clipboard.tsx        # Clipboard Utilities (Module 6)
│   │   ├── contacts.tsx         # Contacts Fetcher (Module 5)
│   │   ├── location.tsx         # Location Tracker (Module 4)
│   │   └── settings.tsx         # Toggle Simulation / Clear DB
│   ├── _layout.tsx              # Root Navigation provider
│   ├── survey-detail.tsx        # Expanded survey record details
│   └── survey-preview.tsx       # Pre-submission preview page (Module 7)
├── assets/                      # Application Static Assets
│   └── images/                  # Icons, background, & simulator mockups
├── components/                  # Reusable UI & Layout Components
│   ├── ui/                      # Base interface elements
│   ├── CustomDrawerContent.tsx  # Drawer UI containing student bio
│   └── CustomHeader.tsx         # Unified Navigation & Screen Header
├── constants/                   # Colors, sizes, & layout themes
│   └── theme.ts                 # Light and Dark mode color palette
├── context/                     # Application State Providers
│   └── SurveyContext.tsx        # Global state and persistence store
├── hooks/                       # Shared custom react hooks
│   └── use-color-scheme.ts      # Device color configuration hook
├── package.json                 # Project dependencies & scripts
└── tsconfig.json                # TypeScript compiler config
```

---

## ⚡ Getting Started & Running the Project

### 1. Installation
Clone the project and install all required node modules:
```bash
npm install
```

### 2. Startup Commands
Run the local bundler:
```bash
# Start expo dev server (Expo Go)
npx expo start

# Alternatively, directly launch on target platforms:
npm run android    # Start Android emulator
npm run ios        # Start iOS simulator
npm run web        # Launch in local web browser
```

### 3. Testing on Emulator vs. Real Hardware
*   **Testing on Real Device:** Open the app using **Expo Go**, navigate to Settings, ensure **Simulated Data Mode is toggled OFF**, and click allow when prompted for Camera, GPS, or Contact access.
*   **Testing on Simulators or Browser:** Go to the navigation drawer, click **Settings**, and toggle **Simulated Data Mode ON**. This will automatically seed simulated sensors so you can test complete user flows without device failures.

---

## 🧪 Verification & Testing Scenarios

1.  **Survey Submission Lifecycle:**
    *   Open App ➔ Settings ➔ Toggle **Simulated Data Mode ON**.
    *   Go to **Contacts** ➔ Search a contact ➔ Click copy.
    *   Go to **Location** ➔ Wait for GPS lock ➔ Click **Attach GPS to Survey**.
    *   Go to **Camera** ➔ Take a picture ➔ Click use.
    *   Go to **New Survey** ➔ Fill "Site A" and "Client B" ➔ Go to **Preview** (Module 7).
    *   Tap **Submit Survey** ➔ Review entry listed inside the **History** tab.
2.  **State Persistence:**
    *   Submit a survey, force close the app / restart the Expo packager, and verify that the survey list in **History** is successfully retrieved from `AsyncStorage`.
3.  **Search & Filters:**
    *   Add surveys of different priorities (Low, Medium, High).
    *   Filter in **History** by clicking the different priority chips to confirm correct filtering behavior.
