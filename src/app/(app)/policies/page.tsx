import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PoliciesPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("id").eq("is_default", true).single();

  const { data: policies } = await supabase
    .from("policy_dashboard")
    .select("*")
    .eq("profile_id", profiles?.id || "")
    .order("date", { ascending: false });

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link href="/settings" className="p-2 -ml-2 rounded-full hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Policies</h1>
        </div>
        <Button size="sm" variant="outline" className="gap-1 rounded-full">
          <Plus className="h-4 w-4" /> New
        </Button>
      </div>

      <div className="grid gap-4">
        {policies?.map((policy) => (
          <div key={policy.id} className="p-4 rounded-xl border bg-card shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{policy.title}</h3>
                <p className="text-xs text-muted-foreground">{policy.provider_name}</p>
              </div>
              <div className="text-right">
                <div className="font-bold">₹{Number(policy.amount).toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">{policy.date ? format(new Date(policy.date), "MMM yyyy") : ""}</div>
              </div>
            </div>
            {policy.note && (
              <div className="text-sm text-muted-foreground mt-2 border-t pt-2">
                {policy.note}
              </div>
            )}
          </div>
        ))}
        {(!policies || policies.length === 0) && (
          <div className="p-6 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
            No policies recorded.
          </div>
        )}
      </div>
    </div>
  );
}
