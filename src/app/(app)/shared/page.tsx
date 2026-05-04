import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2 } from "lucide-react";

export default async function SharedPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("id").eq("is_default", true).single();

  const { data: expenses } = await supabase
    .from("shared_expenses")
    .select("*")
    .eq("payer_profile_id", profiles?.id || "")
    .order("date", { ascending: false });

  const { data: settlements } = await supabase
    .from("settlements")
    .select("*")
    .eq("from_profile_id", profiles?.id || "")
    .order("date", { ascending: false });

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Shared Expenses</h1>
        <Button size="sm" variant="outline" className="gap-1 rounded-full">
          <Plus className="h-4 w-4" /> New
        </Button>
      </div>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Expenses</h2>
          <div className="grid gap-3">
            {expenses?.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm">
                <div>
                  <h3 className="font-semibold">{exp.title}</h3>
                  <p className="text-xs text-muted-foreground">{format(new Date(exp.date || ""), "MMM dd, yyyy")} • Split {exp.split_type}</p>
                </div>
                <div className="text-right font-bold text-destructive">
                  ₹{Number(exp.amount).toFixed(2)}
                </div>
              </div>
            ))}
            {(!expenses || expenses.length === 0) && (
              <div className="p-6 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
                No shared expenses yet.
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Settlements</h2>
          <div className="grid gap-3">
            {settlements?.map((set) => (
              <div key={set.id} className="flex items-center justify-between p-4 rounded-xl border bg-green-500/10 border-green-500/20 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-700">Settled</h3>
                    <p className="text-xs text-green-600/80">{format(new Date(set.date || ""), "MMM dd, yyyy")}</p>
                  </div>
                </div>
                <div className="text-right font-bold text-green-600">
                  ₹{Number(set.amount).toFixed(2)}
                </div>
              </div>
            ))}
            {(!settlements || settlements.length === 0) && (
              <div className="p-6 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
                No settlements recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
