import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { AddBorrowLendForm } from "@/components/finance/add-borrow-lend-form";
import { getActiveProfileId } from "@/app/actions/profile";
import { isBorrowLendUnlocked, hasPinConfigured } from "@/app/actions/pin";
import { PinLockScreen } from "@/components/finance/pin-lock-screen";
import Link from "next/link";

export default async function BorrowLendPage() {
  const hasPin = await hasPinConfigured();
  const isUnlocked = await isBorrowLendUnlocked();

  // If the user has configured a PIN and hasn't unlocked yet, show the lock screen
  if (hasPin && !isUnlocked) {
    return <PinLockScreen />;
  }

  // If the user has NOT configured a PIN, show a prompt to set one
  if (!hasPin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 space-y-4 text-center">
        <div className="p-6 bg-amber-500/10 rounded-full">
          <ArrowDownToLine className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Setup Required</h1>
        <p className="text-muted-foreground text-sm max-w-[280px]">
          You need to set a 4-digit PIN before accessing Borrow & Lend records. This keeps your private financial data secure.
        </p>
        <Link
          href="/settings"
          className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors"
        >
          Go to Settings → Set PIN
        </Link>
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
