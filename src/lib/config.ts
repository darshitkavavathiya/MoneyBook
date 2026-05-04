// App-wide configuration
export const APP_CONFIG = {
  name: "MoneyBook",
  description: "Personal Finance Tracker",
  currency: "INR",
  currencySymbol: "₹",
  // Hardcoded admin email - admin can export all data, view all users
  adminEmail: "admin@moneybook.app", // Change this to your actual admin email
} as const;

// Default expense categories seeded for each new profile
export const DEFAULT_CATEGORIES = {
  expense: [
    "Food",
    "Travel",
    "Bills",
    "Shopping",
    "Entertainment",
    "Health",
    "Education",
    "Other",
  ],
  income: ["Salary", "Investment", "Freelance", "Gift", "Other"],
} as const;

// Account types supported
export const ACCOUNT_TYPES = [
  "Cash",
  "Bank",
  "UPI",
  "Credit Card",
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];
