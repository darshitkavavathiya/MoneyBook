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
**Status:** ✅ Completed
**What was done:**
- Created `src/app/actions/profile.ts` with two server actions:
  - `setActiveProfile(profileId)` — stores selected profile in an HTTP-only cookie.
  - `getActiveProfileId()` — reads the cookie, falls back to the database default profile.
- Updated `ProfileSwitcher` component to call `setActiveProfile` on profile selection and refresh the route via `router.refresh()`.
- Refactored **all 9 pages** that previously used `.eq("is_default", true)` to use `getActiveProfileId()` instead:
  - Dashboard, Transactions, Reports, Shared, Budgets, Categories, Accounts, Policies, Borrow/Lend.
- Updated `AppLayout` to pass `activeProfileId` to `TopBar` → `ProfileSwitcher`, and scoped categories/accounts in the FastEntryModal to the active profile.
