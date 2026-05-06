import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target } from "lucide-react";
import Link from "next/link";
import { AddBudgetForm } from "@/components/finance/add-budget-form";

export default async function BudgetsPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("id").eq("is_default", true).limit(1).maybeSingle();
  const currentMonth = format(new Date(), "yyyy-MM");

  const { data: budgets } = await supabase
    .from("budgets")
    .select("*, category:categories(name)")
    .eq("profile_id", profiles?.id || "")
    .eq("month", currentMonth);

  const { data: categories } = await supabase.from("categories").select("*");

  // In a real scenario, we'd also fetch the sum of transactions for these categories in the current month to show progress bars.
  // We'll skip complex grouping logic for the basic setup and just display the set budgets.

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
          return (
            <div key={b.id} className="p-4 rounded-xl border bg-card shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{catName}</span>
                </div>
                <span className="text-sm font-bold text-muted-foreground">
                  Limit: ₹{Number(b.limit_amount).toFixed(2)}
                </span>
              </div>
              {/* Fake progress bar since we aren't calculating live progress here yet */}
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '0%' }} />
              </div>
              <p className="text-xs text-muted-foreground text-right">0% used</p>
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
        <AddBudgetForm profileId={profiles?.id || ""} categories={categories || []} />
      </div>
    </div>
  );
}
