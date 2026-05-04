# MoneyBook: Comprehensive Testing & Validation Plan

This plan is designed to audit the current state of the application (estimated at 20% completion) and identify gaps before moving to the final 80% of implementation.

## 1. Authentication & Session Persistence
**Issue**: User reports being asked to login with Google repeatedly.
- [ ] **Test Case 1.1**: Login with Google and refresh the page. Check if the session persists.
- [ ] **Test Case 1.2**: Inspect browser cookies for `sb-access-token` and `sb-refresh-token`.
- [ ] **Test Case 1.3**: Validate `src/proxy.ts` and `src/lib/supabase/proxy.ts` to ensure `Set-Cookie` headers are correctly forwarded from Supabase.
- [ ] **Test Case 1.4**: Test session expiration behavior.

## 2. Multi-Profile System
- [ ] **Test Case 2.1**: Create multiple profiles (Personal, Business).
- [ ] **Test Case 2.2**: Switch profiles via the `ProfileSwitcher`.
- [ ] **Test Case 2.3**: Verify that switching a profile updates the global data (Transactions, Accounts, Dashboard) without needing a page refresh.
- [ ] **Test Case 2.4**: Ensure `profile_id` is correctly saved in the session or a cookie to persist across navigation.

## 3. Core Finance Modules (Accounts & Categories)
- [ ] **Test Case 3.1**: Create accounts (Cash, Bank, UPI). Verify initial balance.
- [ ] **Test Case 3.2**: Create custom categories. Verify they appear in transaction forms.
- [ ] **Test Case 3.3**: Check if default categories are correctly seeded upon new profile creation.

## 4. Transaction Flow
- [ ] **Test Case 4.1**: Add an Income transaction. Verify Account balance increases.
- [ ] **Test Case 4.2**: Add an Expense transaction. Verify Account balance decreases.
- [ ] **Test Case 4.3**: Test the "Fast Entry Modal" (`+` button).
- [ ] **Test Case 4.4**: **Audit**: Verify if the `attachments` upload logic is actually working or just a placeholder.

## 5. Advanced Modules (Shared, Borrow/Lend, Budgets)
- [ ] **Test Case 5.1 (Shared)**: Create an expense and split it among 3 people. Check if "Settlements" and "Balances" update correctly.
- [ ] **Test Case 5.2 (Borrow/Lend)**: Test the PIN protection.
    - [ ] Set a PIN.
    - [ ] Try to access the module without a PIN.
    - [ ] Verify PIN hashing in the database (`user_roles`).
- [ ] **Test Case 5.3 (Budgets)**: Set a category limit and add an expense that exceeds it. Check if the "Alert/Progress Bar" triggers.

## 6. Reports & Analytics
- [ ] **Test Case 6.1**: Verify "Total Income" and "Total Expense" calculations on the Dashboard.
- [ ] **Test Case 6.2**: Check Recharts visualizations for category-wise breakdowns.
- [ ] **Test Case 6.3**: Verify data accuracy between the table view and the chart view.

## 7. Admin & Export
- [ ] **Test Case 7.1**: Log in as an Admin. Verify access to the "Export" button.
- [ ] **Test Case 7.2**: Trigger "Export to Excel" and verify the `.xlsx` file contains all user data.
- [ ] **Test Case 7.3**: Attempt to access Admin features as a regular user (should fail).

## 8. PWA & Mobile UX
- [ ] **Test Case 8.1**: Open in mobile browser. Test Bottom Navigation responsiveness.
- [ ] **Test Case 8.2**: Check "Add to Home Screen" prompt.
- [ ] **Test Case 8.3**: Verify offline shell loading (can the app open without a network?).
