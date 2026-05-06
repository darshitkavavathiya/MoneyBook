# Personal Finance Tracker — Final AI Build Prompt (Next.js + Supabase)

Build a **mobile-first Progressive Web App (PWA)** called:

**Personal Finance Tracker**

Tech stack:
- Next.js (App Router)
- TypeScript
- Supabase Auth (Google login only)
- Supabase PostgreSQL database
- Supabase Storage (attachments)
- TailwindCSS + shadcn/ui
- Server Actions
- PWA install support

App must be optimized for **Android mobile usage first**, desktop second.

## Authentication
- Google login only via Supabase Auth
- After login: create user profile automatically, assign default role = user
- Admin role: hardcoded admin email inside config
- Admin permissions: export all users data, view all users, future role-management ready

## Multi-profile system
Each user can create multiple finance profiles (e.g., Personal, Family, Business).
Structure:
User
 └── Profiles
      ├── Accounts
      ├── Categories
      ├── Transactions
      ├── Budgets
      ├── SharedExpenses
      ├── Settlements
      ├── BorrowLend
      └── PolicyDashboard
Currency: INR only (schema future-ready for multi-currency)

## Core Modules
### Income Tracking
- amount, category_id, account_id, note, date, attachment (optional), profile_id

### Expense Tracking
- amount, category_id, account_id, participants (optional), split_type (equal, custom, percentage future-ready), attachment (optional), note, date, profile_id

### Categories
- Support: default categories, custom categories, edit/delete, per profile
- Examples: Food, Travel, Bills, Shopping, Salary, Investment

### Accounts Module
- Account types supported: Cash, Bank, UPI, Credit Card
- Fields: name, type, balance, profile_id

### Budget Module
- Users can: set monthly category limits, receive alert when near limit, receive alert when exceeded
- Display: progress bars, monthly tracking dashboard

### Attachments Module
- Support: image upload, store in Supabase Storage, linked to transaction_id
- Future-ready: PDF upload support

### Shared Expense Module (Splitwise-style)
- Users can: select participants, split equally, split custom amounts, track balances, record settlements, view settlement history
- Tables required: shared_expenses, shared_participants, settlements, balance_summary_view
- Balances calculated automatically.

### Borrow / Lend Module (PIN protected)
- Fields: person_name, type (borrowed / lent), amount, date, note, profile_id
- Security requirement: Require PIN unlock before viewing section, PIN stored securely (hashed)

### Policy Dashboard Module (basic tracker)
- Fields: title, provider_name, amount, date, note, profile_id
- Visible normally (no lock)

### Reports Dashboard
- Display: total income, total expenses, savings, category-wise charts, account-wise breakdown, monthly trends
- Use: Recharts, mobile-first visualization required.

### Excel Export Module (Admin-only)
- Export: all users, all profiles, transactions, borrow/lend, shared expenses, settlements, policy dashboard
- Format: multiple sheets, clean column structure, timestamped filename
- Use: xlsx library (Server-side export only)

### Database Schema (Supabase PostgreSQL)
Create tables: users, profiles, accounts, categories, transactions, budgets, shared_expenses, shared_participants, settlements, borrow_lend, policy_dashboard, attachments, user_roles
Implement Row Level Security (RLS). Rules: users access only their own profiles, participants access shared expenses they belong to, admin can access everything.

### UI Layout
- Mobile-first design.
- Bottom navigation tabs: Dashboard, Transactions, Shared, Borrow/Lend, Reports, Settings
- Include: profile switcher, dark mode support, fast entry modal button (+)
- Use: shadcn/ui components

### PWA Requirements
- Support: install to home screen, offline shell loading, mobile splash screen, icon support, manifest.json, service worker
- Android install experience required.

### Security Rules
- Implement: RLS policies, profile-based access control, admin override access, PIN-protected borrow/lend module, secure storage for attachments

### Performance Requirements
- Optimize for: mobile-first UI, fast page transitions, server actions over API routes where possible, lazy loading charts, efficient DB queries
