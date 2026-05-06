# Implementation 3: Advanced Finance

## 3.1 Budgets Module
**Status:** ✅ Completed
- Built Budgets UI and add form.
- Fetches constraints and monthly limits.

### 3.1.1 Fix: Dynamic Budget Tracking & Alerts
**Status:** 🔴 Pending
**Objective:** Replace the static "0% progress" bar on the Budgets page with live spending calculations mapped to category limits.
**Implementation Steps:**
1. **Fetch Month's Transactions:** On the Budgets page (`src/app/(app)/settings/budgets/page.tsx`), query the `transactions` table for all expenses that occurred within the current calendar month for the budgeted `category_id`.
2. **Calculate Spending Metrics:** Sum the total amount of those fetched transactions to find `totalSpent`. Calculate the usage percentage using `(totalSpent / limit_amount) * 100`.
3. **Dynamic UI Rendering:** Update the progress bar to use the calculated percentage. If `percentage >= 100`, change the progress bar color to red (`bg-destructive`) to alert the user.

## 3.2 Shared Expenses Module
**Status:** ✅ Completed
- Built Shared Expense UI and entry forms.
- Structured settlement display logic.

### 3.2.1 Fix: Shared Expense Splitting Algorithm
**Status:** 🔴 Pending
**Objective:** Enhance the basic "Shared Expense" creation form to actually split costs among multiple participants and calculate individual debts.
**Implementation Steps:**
1. **Update Form & Schema:** Enhance the `AddSharedExpenseForm` to include a multi-select input where the user can pick participating profiles.
2. **Refactor Backend Logic:** Update `addSharedExpense` in `src/app/actions/advanced.ts`. When a user submits a shared expense, divide the `amount` by the total number of selected participants.
3. **Generate Debts:** For every participant that is *not* the payer, record that they owe the payer their split portion (update `settlements` tracking).

## 3.3 Borrow & Lend Module
**Status:** ✅ Completed
- Built Borrow/Lend CRUD operations.
- Implemented visual indicators for "To Pay" vs "To Collect".

### 3.3.1 Fix: Borrow/Lend PIN Protection
**Status:** 🔴 Pending
**Objective:** Replace the mock "Unlock (Demo)" lock screen with an actual PIN verification system.
**Implementation Steps:**
1. **PIN Configuration UI:** Add a configuration section within the `Settings` page where a user can define or reset their 4-digit PIN for the active profile.
2. **Verification Logic:** In the Borrow/Lend lock screen (`src/app/(app)/borrow-lend/page.tsx`), update the form action to accept a 4-digit input. Compare it securely against the profile's stored PIN.
3. **Secure Session:** If successful, set a temporary secure cookie (e.g., `borrow_lend_unlocked=true`) that expires after a short session window.

## 3.4 Policy Dashboard
**Status:** ✅ Completed
- Built Policy tracking layout and integration.
