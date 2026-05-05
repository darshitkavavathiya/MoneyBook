import { createClient } from "@/lib/supabase/server";
import dynamic from "next/dynamic";
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from "date-fns";

const ExpensePieChart = dynamic(
  () => import("@/components/charts/expense-pie-chart").then(mod => mod.ExpensePieChart),
  { loading: () => <div className="flex items-center justify-center h-[280px] text-sm text-muted-foreground">Loading chart...</div> }
);

const IncomeExpenseBarChart = dynamic(
  () => import("@/components/charts/income-expense-bar-chart").then(mod => mod.IncomeExpenseBarChart),
  { loading: () => <div className="flex items-center justify-center h-[280px] text-sm text-muted-foreground">Loading chart...</div> }
);

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("id").eq("is_default", true).limit(1).maybeSingle();
  const profileId = profiles?.id;

  // 1. Fetch data for Category Pie Chart (Current Month Expenses)
  const currentMonthStart = startOfMonth(new Date()).toISOString();
  const currentMonthEnd = endOfMonth(new Date()).toISOString();

  const { data: expenseTx } = await supabase
    .from("transactions")
    .select(`amount, category:categories(name)`)
    .eq("profile_id", profileId || "")
    .eq("type", "expense")
    .gte("date", currentMonthStart)
    .lte("date", currentMonthEnd);

  // Aggregate by category
  const categoryMap = new Map<string, number>();
  expenseTx?.forEach(tx => {
    // @ts-ignore
    const catName = tx.category?.name || "Uncategorized";
    const amount = Number(tx.amount);
    categoryMap.set(catName, (categoryMap.get(catName) || 0) + amount);
  });
  
  const pieData = Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Sort descending


  // 2. Fetch data for Income vs Expense Bar Chart (Last 6 Months)
  const sixMonthsAgo = subMonths(startOfMonth(new Date()), 5).toISOString(); // 5 months ago + current month = 6

  const { data: monthlyTx } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("profile_id", profileId || "")
    .gte("date", sixMonthsAgo);

  // Aggregate by month
  const monthlyMap = new Map<string, { income: number, expense: number }>();
  
  // Initialize last 6 months to ensure they show up even if empty
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(new Date(), i);
    monthlyMap.set(format(d, "MMM yyyy"), { income: 0, expense: 0 });
  }

  monthlyTx?.forEach(tx => {
    const monthKey = format(parseISO(tx.date), "MMM yyyy");
    if (monthlyMap.has(monthKey)) {
      const data = monthlyMap.get(monthKey)!;
      if (tx.type === "income") data.income += Number(tx.amount);
      if (tx.type === "expense") data.expense += Number(tx.amount);
    }
  });

  const barData = Array.from(monthlyMap.entries()).map(([name, data]) => ({
    name: name.split(" ")[0], // Just show 'Jan', 'Feb', etc on x-axis
    income: data.income,
    expense: data.expense
  }));

  return (
    <div className="p-4 space-y-6 pb-20">
      <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
      
      <div className="space-y-6">
        {/* Expense Breakdown Card */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold">Expense Breakdown</h2>
            <p className="text-xs text-muted-foreground">Current Month ({format(new Date(), "MMMM")})</p>
          </div>
          <ExpensePieChart data={pieData} />
        </div>

        {/* Income vs Expense Trends Card */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold">Income vs Expense</h2>
            <p className="text-xs text-muted-foreground">Last 6 Months</p>
          </div>
          <IncomeExpenseBarChart data={barData} />
        </div>
      </div>
    </div>
  );
}
