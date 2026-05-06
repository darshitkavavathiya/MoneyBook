import { createClient } from "@/lib/supabase/server";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ArrowLeft, Target, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { AddBudgetForm } from "@/components/finance/add-budget-form";
import { getActiveProfileId } from "@/app/actions/profile";

export default async function BudgetsPage() {
  const supabase = await createClient();
  const profileId = await getActiveProfileId();
  const currentMonth = format(new Date(), "yyyy-MM");

  const { data: budgets } = await supabase
    .from("budgets")
    .select("*, category:categories(name)")
    .eq("profile_id", profileId || "")
    .eq("month", currentMonth);

  const { data: categories } = await supabase.from("categories").select("*");

  // Fetch this month's expense transactions to calculate spending per category
  const monthStart = startOfMonth(new Date()).toISOString();
  const monthEnd = endOfMonth(new Date()).toISOString();

  const { data: monthlyTransactions } = await supabase
    .from("transactions")
    .select("amount, category_id")
    .eq("profile_id", profileId || "")
    .eq("type", "expense")
    .gte("date", monthStart)
    .lte("date", monthEnd);

  // Build a map of category_id -> total spent this month
  const spentMap = new Map<string, number>();
  monthlyTransactions?.forEach(tx => {
    if (!tx.category_id) return;
    const existing = spentMap.get(tx.category_id) || 0;
    spentMap.set(tx.category_id, existing + Number(tx.amount));
  });

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/settings" className="p-2 -ml-2 rounded-full hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {format(new Date(), "MMMM yyyy")}
        </h2>
        {budgets?.map((b) => {
          // @ts-ignore
          const catName = b.category?.name || "Unknown";
          const limit = Number(b.limit_amount);
          const spent = spentMap.get(b.category_id) || 0;
          const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
          const isOverBudget = percentage >= 100;

          return (
            <div key={b.id} className="p-4 rounded-xl border bg-card shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className={`h-4 w-4 ${isOverBudget ? 'text-destructive' : 'text-primary'}`} />
                  <span className="font-semibold">{catName}</span>
                  {isOverBudget && <AlertTriangle className="h-4 w-4 text-destructive" />}
                </div>
                <span className="text-sm font-bold text-muted-foreground">
                  ₹{spent.toFixed(2)} / ₹{limit.toFixed(2)}
                </span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${isOverBudget ? 'bg-destructive' : 'bg-primary'}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <p className={`text-xs text-right ${isOverBudget ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                {percentage}% used
              </p>
            </div>
          );
        })}
        {(!budgets || budgets.length === 0) && (
          <div className="p-6 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
            No budgets set for this month.
          </div>
        )}
      </div>

      <div className="pt-4">
        <AddBudgetForm profileId={profileId || ""} categories={categories || []} />
      </div>
    </div>
  );
}
