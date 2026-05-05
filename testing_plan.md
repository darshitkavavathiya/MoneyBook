# MoneyBook: Automation & Manual Testing Plan

## Phase 1: Automation Strategy

We will use a combination of **Browser Automation** (using my internal tools) and **Playwright** (for your local CI/CD) to test the following flows.

### 1. Authentication Flow (Automated)

- [ ] **Scenario**: Visit landing page -> Click Get Started -> Verify Login page load.
- [ ] **Scenario**: Post-OAuth Callback -> Verify redirect to `/dashboard`.
- [ ] **Scenario**: Refresh page -> Verify session persistence (No logout loop).

### 2. Multi-Profile & Context (Automated)

- [ ] **Scenario**: Open Profile Switcher -> Select a different profile -> Verify UI updates.
- [ ] **Scenario**: Verify that data (Transactions/Accounts) is filtered by the selected `profile_id`.

### 3. Core CRUD Operations (Automated)

- [ ] **Accounts**: Create "Cash" account with ₹5000 -> Verify it appears in the list.
- [ ] **Categories**: Create "Food" category -> Verify it appears in the dropdown.
- [ ] **Transactions**: Add ₹1000 Income -> Verify Account balance becomes ₹6000.
- [ ] **Transactions**: Add ₹500 Expense -> Verify Account balance becomes ₹5500.

### 4. Advanced Module Logic (Deep Audit)

- [ ] **Shared Expenses**:
  - [ ] Create expense of ₹300.
  - [ ] Split equally between 3 people.
  - [ ] Verify each person owes ₹100 in the "Balances" view.
- [ ] **Borrow/Lend (PIN)**:
  - [ ] Try to access without PIN -> Verify "Locked" screen.
  - [ ] Enter PIN -> Verify access granted.
- [ ] **Budgets**:
  - [ ] Set "Food" budget to ₹1000.
  - [ ] Add ₹1200 Food expense -> Verify "Over Budget" alert/indicator appears.

### 5. Admin & Reports (Automated)

- [ ] **Charts**: Verify Recharts components are rendered and not crashing.
- [ ] **Export**: Click "Export to Excel" (Admin only) -> Verify file generation.

---

## Phase 2: Implementation of Automation

I will now begin running these tests using my browser subagent. I will start with the **Auth and Profile Switcher** flows since those are the heart of the app.

**Ready to start?** I'll begin by visiting your Vercel URL and performing a baseline check.
