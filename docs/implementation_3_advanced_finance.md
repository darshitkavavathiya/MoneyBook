# Implementation 3: Advanced Finance

## 3.1 Budgets Module
**Status:** ✅ Completed
- Built Budgets UI and add form.
- Fetches constraints and monthly limits.

### 3.1.1 Fix: Dynamic Budget Tracking & Alerts
**Status:** ✅ Completed
**What was done:**
- Rewrote `src/app/(app)/settings/budgets/page.tsx` to fetch all expense transactions for the current month.
- Built a `spentMap` (Map of `category_id` → `totalSpent`) from actual transaction data.
- For each budget, dynamically calculates `percentage = (spent / limit) * 100`.
- Progress bar width is now live. When spending exceeds the limit, the bar turns red (`bg-destructive`) and an `AlertTriangle` icon appears.
- The label now shows exact `₹spent / ₹limit` instead of a static "Limit: ₹X".

## 3.2 Shared Expenses Module
**Status:** ✅ Completed
- Built Shared Expense UI and entry forms.
- Structured settlement display logic.

### 3.2.1 Fix: Shared Expense Splitting Algorithm
**Status:** ✅ Completed
**What was done:**
- Rewrote `AddSharedExpenseForm` to include multi-select profile toggles (chip buttons) where the user picks who to split with.
- Selected participant IDs are serialized as JSON in the form data.
- Updated `addSharedExpense` in `src/app/actions/advanced.ts`:
  - Parses participant IDs from the form.
  - Calculates equal split: `amount / (payer + selected participants)`.
  - Inserts records into the `shared_participants` table for each person's share.
- Rewrote the Shared Expenses page (`src/app/(app)/shared/page.tsx`):
  - Fetches participants alongside expenses using a Supabase join.
  - Displays per-person split amounts as colored chips under each expense.
  - Added a green "Others Owe You" summary card aggregating what other profiles owe the current user.

## 3.3 Borrow & Lend Module
**Status:** ✅ Completed
- Built Borrow/Lend CRUD operations.
- Implemented visual indicators for "To Pay" vs "To Collect".

### 3.3.1 Fix: Borrow/Lend PIN Protection
**Status:** ✅ Completed
**What was done:**
- Created `src/app/actions/pin.ts` with four server actions:
  - `setPin()` — stores the 4-digit PIN in `user_roles.pin_hash`.
  - `verifyPin()` — validates the PIN and sets a 15-minute `borrow_lend_unlocked` cookie.
  - `isBorrowLendUnlocked()` — checks the cookie status.
  - `hasPinConfigured()` — checks if the user has a PIN set.
- Created `src/components/finance/pin-lock-screen.tsx`:
  - Real 4-digit input with auto-focus advancement and backspace navigation.
  - Error messages for incorrect PIN attempts.
  - Loading state during verification.
- Created `src/components/finance/set-pin-form.tsx`:
  - Inline PIN configuration component for the Settings page.
  - Shows "Set PIN" for new users and "Update" for users with existing PINs.
  - Success confirmation feedback.
- Rewrote `src/app/(app)/borrow-lend/page.tsx`:
  - Removed the mock "Unlock (Demo)" button entirely.
  - If user has PIN → shows real PinLockScreen until correct PIN is entered.
  - If user has no PIN → shows a "Setup Required" prompt linking to Settings.
  - After successful unlock, the cookie keeps the user authenticated for 15 minutes.
- Added the `SetPinForm` to Settings page under a new "Security" section.

## 3.4 Policy Dashboard
**Status:** ✅ Completed
- Built Policy tracking layout and integration.
