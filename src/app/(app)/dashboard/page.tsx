import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profiles } = await supabase.from("profiles").select("id").eq("is_default", true).single();

  const profileId = profiles?.id;

  // Fetch accounts total balance
  const { data: accounts } = await supabase
    .from("accounts")
    .select("current_balance")
    .eq("profile_id", profileId || "");

  const totalBalance = accounts?.reduce((sum, acc) => sum + Number(acc.current_balance), 0) || 0;

  // Fetch current month's transactions
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("profile_id", profileId || "")
    .gte("date", startOfMonth.toISOString());

  const monthlyIncome = transactions?.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  const monthlyExpense = transactions?.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="rounded-xl border bg-primary text-primary-foreground shadow-lg p-6">
        <h2 className="font-medium opacity-90 mb-1">Total Net Worth</h2>
        <div className="text-4xl font-bold">₹{totalBalance.toFixed(2)}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-1">Total Income</div>
          <div className="text-xl font-bold text-green-600">₹{Number(monthlyIncome).toFixed(2)}</div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-1">Total Expenses</div>
          <div className="text-xl font-bold text-destructive">₹{Number(monthlyExpense).toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-4">Quick Insights</h3>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 text-center text-muted-foreground text-sm">
          Detailed charts will appear here in Phase 7.
        </div>
      </div>
    </div>
  );
}
