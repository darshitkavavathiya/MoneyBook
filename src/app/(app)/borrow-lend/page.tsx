import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { ArrowDownToLine, ArrowUpFromLine, Lock } from "lucide-react";
import { AddBorrowLendForm } from "@/components/finance/add-borrow-lend-form";
import { getActiveProfileId } from "@/app/actions/profile";

export default async function BorrowLendPage({
  searchParams,
}: {
  searchParams: Promise<{ unlocked?: string }>;
}) {
  const isUnlocked = (await searchParams).unlocked === "true";

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 space-y-6">
        <div className="p-6 bg-primary/10 rounded-full">
          <Lock className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-center">PIN Protected Area</h1>
        <p className="text-center text-muted-foreground text-sm max-w-[250px]">
          Enter your 4-digit PIN to access your Borrow & Lend records.
        </p>
        <form className="flex flex-col items-center gap-4 w-full max-w-xs">
          <div className="flex gap-2 justify-center w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold bg-card shadow-sm">*</div>
            ))}
          </div>
          <button type="submit" className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors" formAction={async () => {
            "use server";
            import("next/navigation").then(m => m.redirect("/borrow-lend?unlocked=true"));
          }}>
            Unlock (Demo)
          </button>
        </form>
      </div>
    );
  }

  const supabase = await createClient();
  const profileId = await getActiveProfileId();

  const { data: records } = await supabase
    .from("borrow_lend")
    .select("*")
    .eq("profile_id", profileId || "")
    .order("date", { ascending: false });

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Borrow & Lend</h1>
        <AddBorrowLendForm profileId={profileId || ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <ArrowDownToLine className="h-4 w-4" />
            <div className="text-sm font-medium">To Pay</div>
          </div>
          <div className="text-xl font-bold text-destructive">
            ₹{records?.filter(r => r.type === "borrowed" && !r.is_settled).reduce((sum, r) => sum + Number(r.amount), 0).toFixed(2) || "0.00"}
          </div>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <ArrowUpFromLine className="h-4 w-4" />
            <div className="text-sm font-medium">To Collect</div>
          </div>
          <div className="text-xl font-bold text-green-600">
            ₹{records?.filter(r => r.type === "lent" && !r.is_settled).reduce((sum, r) => sum + Number(r.amount), 0).toFixed(2) || "0.00"}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Active Records</h2>
        {records?.filter(r => !r.is_settled).map((record) => (
          <div key={record.id} className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${record.type === 'lent' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                {record.type === 'lent' ? <ArrowUpFromLine className="h-4 w-4" /> : <ArrowDownToLine className="h-4 w-4" />}
              </div>
              <div>
                <h3 className="font-semibold">{record.person_name}</h3>
                <p className="text-xs text-muted-foreground">{format(new Date(record.date || ""), "MMM dd, yyyy")} • {record.type}</p>
              </div>
            </div>
            <div className={`text-right font-bold ${record.type === 'lent' ? 'text-green-600' : 'text-destructive'}`}>
              ₹{Number(record.amount).toFixed(2)}
            </div>
          </div>
        ))}
        {records?.filter(r => !r.is_settled).length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
            No active borrow/lend records.
          </div>
        )}
      </div>
    </div>
  );
}
