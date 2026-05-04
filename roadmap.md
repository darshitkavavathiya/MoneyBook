# Implementation Roadmap: Personal Finance Tracker

## Phase 1: Environment Setup & Foundation ✅ COMPLETED
- [x] Initialize Next.js project with App Router and TypeScript.
- [x] Configure TailwindCSS v4 and integrate `shadcn/ui` (base-nova style).
- [x] Setup `next-pwa` for PWA capabilities (manifest, service worker).
- [x] Setup Supabase project (Auth, Database, Storage).
- [x] Add Supabase environment variables (`.env.local`).
- [x] Configure Supabase MCP server for database management.
- [x] Create Supabase client utilities (`client.ts`, `server.ts`, `proxy.ts`).
- [x] Setup Next.js 16 proxy (`proxy.ts`) for session refresh.
- [x] Configure `next-themes` for dark mode support (`ThemeProvider`).
- [x] Create app configuration (`config.ts`) with admin email, defaults.
- [x] Landing page with branding and CTA.
- [x] Production build passes cleanly.

### Phase 1 Notes:
- **Database**: Clean slate — previous incomplete tables dropped, 0 migrations.
- **shadcn/ui**: Using `base-nova` style (Tailwind v4, `@base-ui/react`). Use `render` prop instead of `asChild` for polymorphic rendering.
- **Next.js 16**: Uses `proxy.ts` (not `middleware.ts`). Turbopack is default.
- **Supabase key**: Using publishable key (`sb_publishable_*`), not legacy anon key.

## Phase 2: Database Schema & Security (Supabase) ✅ COMPLETED
- [x] Write and apply SQL for all 12 core tables.
- [x] Configure Row Level Security (RLS) policies — all scoped to `authenticated` only.
- [x] Create `balance_summary_view` with `security_invoker = true`.
- [x] Setup `on_auth_user_created` trigger (auto-creates role, profile, categories).
- [x] Setup `attachments` storage bucket (private) with RLS policies.
- [x] Add FK indexes on all foreign key columns for performance.
- [x] Add `updated_at` columns and auto-update triggers on core tables.
- [x] Add `month` column + unique constraint on `budgets`.
- [x] Security audit: Revoke EXECUTE from anon/public on SECURITY DEFINER functions.
- [x] Security audit: Set `search_path = ''` on all functions.
- [x] Performance: Merge admin policies into user policies (no duplicate permissive).
- [x] Performance: Wrap `auth.uid()` in `(select ...)` for RLS initplan optimization.

### Phase 2 Notes:
- **Tables (12)**: user_roles, profiles, accounts, categories, transactions, shared_expenses, shared_participants, settlements, borrow_lend, budgets, policy_dashboard, attachments.
- **Functions (4)**: `is_profile_owner()`, `is_admin()`, `handle_new_user()`, `update_updated_at()` — all with `search_path = ''`, EXECUTE revoked from anon/authenticated/public.
- **RLS**: 46 policies across 12 tables, all scoped to `authenticated` role only.
- **View**: `balance_summary_view` — aggregates income/expense per profile.
- **Indexes**: 18 FK indexes + 1 date index on transactions.

## Phase 3: Core Application Shell & Navigation ✅ COMPLETED
- [x] Develop mobile-first layout structure.
- [x] Implement Bottom Navigation Bar.
- [x] Implement Dark Mode toggle.
- [x] Setup routing structure (Dashboard, Transactions, Shared, Borrow/Lend, Reports, Settings).
- [x] Create Profile Switcher UI.

## Phase 4: Authentication & User Management ✅ COMPLETED
- [x] Integrate Supabase Google Auth.
- [x] Implement protected routes (`proxy.ts`).
- [x] Setup Admin access control logic.
- [x] Create User Settings / Profile page.

## Phase 5: Transactions & Accounts Core ✅ COMPLETED
- [x] Build Accounts Module (CRUD operations).
- [x] Build Categories Module (CRUD operations).
- [x] Build Income & Expense Tracking functionality.
- [x] Implement Fast Entry Modal Button (`+`).
- [x] Integrate Supabase Storage for attachments.

## Phase 6: Advanced Modules ✅ COMPLETED
- [x] Build Shared Expense Module (Split logic & settlements).
- [x] Build Borrow/Lend Module (Implement PIN protection logic).
- [x] Build Budget Module (Limits and progress bars).
- [x] Build Policy Dashboard Module.

## Phase 7: Analytics & Admin Features ✅ COMPLETED
- [x] Integrate `recharts` for Reports Dashboard.
- [x] Build category-wise and account-wise visual breakdowns.
- [x] Build Excel Export Module (`xlsx` library) for Admin.

## Phase 8: Polish & PWA Optimization ✅ COMPLETED
- [x] Optimize mobile splash screens and icons.
- [x] Audit PWA installability (Lighthouse).
- [x] Performance tuning (Lazy loading charts, server actions review).
- [x] Final testing of RLS policies and split logic.

🎉 **All Phases Completed!** MoneyBook is ready for production.
