# Implementation 1: Foundation & Setup

## 1.1 Next.js & UI Framework Setup
**Status:** ✅ Completed
- Initialized Next.js project with App Router and TypeScript.
- Configured TailwindCSS v4 and integrated `shadcn/ui` (base-nova style).
- Setup `next-themes` for dark mode support.

## 1.2 Supabase Database & Security
**Status:** ✅ Completed
- Wrote and applied SQL for all 12 core tables.
- Configured Row Level Security (RLS) policies scoped to `authenticated` only.
- Set up automated Database Triggers (e.g., `on_auth_user_created`).

## 1.3 Routing Shell & Navigation
**Status:** ✅ Completed
- Developed mobile-first layout structure.
- Implemented Bottom Navigation Bar.
- Setup main app routes (Dashboard, Transactions, Shared, Borrow/Lend, Reports, Settings).

## 1.4 Auth & Profiles
**Status:** ✅ Completed
- Integrated Supabase Google Auth.
- Implemented protected routes via `proxy.ts`.
- Created Profile Switcher UI.

### 1.4.1 Fix: Global Profile Context Switching
**Status:** 🔴 Pending
**Objective:** The app currently relies heavily on querying `.eq("is_default", true)`. We need proper switching between "Personal" and "Business" profiles.
**Implementation Steps:**
1. **State Management Setup:** Use `next/headers` to manage an HTTP-only cookie called `activeProfileId`.
2. **Create Action:** Create a new server action `setActiveProfile(profileId: string)` that writes the selected Profile ID to the cookie.
3. **Update Profile Switcher Component:** In `src/components/layout/profile-switcher.tsx`, trigger `setActiveProfile` when the user clicks a different profile from the dropdown, then refresh the route.
4. **Refactor Page Queries:** Update the data fetching logic across the application (Dashboard, Transactions, Settings) to read the `activeProfileId` cookie instead of hardcoding the default profile.
