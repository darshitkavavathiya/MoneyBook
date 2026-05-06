import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { CheckCircle2, Users } from "lucide-react";
import { AddSharedExpenseForm } from "@/components/finance/add-shared-expense-form";
import { getActiveProfileId } from "@/app/actions/profile";

export default async function SharedPage() {
  const supabase = await createClient();
  const profileId = await getActiveProfileId();

  // Fetch all profiles for participant selection
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  // Fetch shared expenses where this profile is the payer
  const { data: expenses } = await supabase
    .from("shared_expenses")
    .select("*, participants:shared_participants(profile_id, amount, profile:profiles(name))")
    .eq("payer_profile_id", profileId || "")
    .order("date", { ascending: false });

  // Fetch shared expenses where this profile is a participant (but NOT the payer)
  const { data: owedExpenses } = await supabase
    .from("shared_participants")
    .select("amount, shared_expense:shared_expenses(title, date, amount, payer_profile_id, payer:profiles!shared_expenses_payer_profile_id_fkey(name))")
    .eq("profile_id", profileId || "")
    .neq("shared_expense.payer_profile_id", profileId || "");

  const settlements = await supabase
    .from("settlements")
    .select("*")
    .eq("from_profile_id", profileId || "")
    .order("date", { ascending: false });

  // Calculate "Others owe you" from expenses you paid
  const othersOweYou: { name: string; amount: number }[] = [];
  expenses?.forEach(exp => {
    // @ts-ignore
    const participants = exp.participants || [];
    participants.forEach((p: { profile_id: string; amount: number; profile: { name: string } | null }) => {
      if (p.profile_id !== profileId) {
        const name = p.profile?.name || "Unknown";
        const existing = othersOweYou.find(o => o.name === name);
        if (existing) {
          existing.amount += Number(p.amount);
        } else {
          othersOweYou.push({ name, amount: Number(p.amount) });
        }
      }
    });
  });

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Shared Expenses</h1>
        <AddSharedExpenseForm payerProfileId={profileId || ""} profiles={profiles || []} />
      </div>

      {/* Who Owes You Summary */}
      {othersOweYou.length > 0 && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 shadow-sm space-y-2">
          <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wider flex items-center gap-1">
            <Users className="h-4 w-4" /> Others Owe You
          </h2>
          {othersOweYou.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm font-bold text-green-600">₹{item.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Expenses You Paid</h2>
          <div className="grid gap-3">
            {expenses?.map((exp) => {
              // @ts-ignore
              const participants = exp.participants || [];
              const participantCount = participants.length;
              return (
                <div key={exp.id} className="p-4 rounded-xl border bg-card shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{exp.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(exp.date || ""), "MMM dd, yyyy")} • Split {exp.split_type}
                        {participantCount > 0 && ` • ${participantCount} people`}
                      </p>
                    </div>
                    <div className="text-right font-bold text-destructive">
                      ₹{Number(exp.amount).toFixed(2)}
                    </div>
                  </div>
                  {participantCount > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {participants.map((p: { profile_id: string; amount: number; profile: { name: string } | null }, i: number) => (
                        <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${
                          p.profile_id === profileId
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {p.profile?.name || "Unknown"}: ₹{Number(p.amount).toFixed(2)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
            {settlements.data?.map((set) => (
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
            {(!settlements.data || settlements.data.length === 0) && (
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
