# Implementation 2: Core Finance

## 2.1 Accounts CRUD
**Status:** ✅ Completed
- Built Accounts Module.
- Refactored UI to use controlled inputs and Server Actions.

## 2.2 Categories CRUD
**Status:** ✅ Completed
- Built Categories Module.
- Implemented income and expense category separation.

## 2.3 Transactions & Fast Entry
**Status:** ✅ Completed
- Built Income & Expense Tracking functionality.
- Implemented Fast Entry Modal Button (`+`) with loading spinners.

### 2.3.1 Fix: Account Balance Sync Integration
**Status:** 🔴 Pending
**Objective:** Creating a transaction currently inserts the record but does not dynamically update the related bank account's balance.
**Implementation Steps:**
1. **Refactor `addTransaction` Action:** Locate `src/app/actions/finance.ts`.
2. **Fetch Current Balance:** Before inserting the transaction, query the `accounts` table for the `current_balance` of the selected `account_id`.
3. **Calculate New Balance:**
   - If `type === 'income'`, calculate `newBalance = currentBalance + amount`.
   - If `type === 'expense'`, calculate `newBalance = currentBalance - amount`.
4. **Execute Update:** Run an `UPDATE` on the `accounts` table setting `current_balance = newBalance`. Ensure both the insert and update complete together.
