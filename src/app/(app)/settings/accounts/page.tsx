import { createClient } from "@/lib/supabase/server";
import { Building2, Wallet, CreditCard, Smartphone } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AddAccountForm } from "@/components/finance/add-account-form";

const getIconForType = (type: string) => {
  switch (type) {
    case "Cash": return <Wallet className="h-5 w-5" />;
    case "Bank": return <Building2 className="h-5 w-5" />;
    case "UPI": return <Smartphone className="h-5 w-5" />;
    case "Credit Card": return <CreditCard className="h-5 w-5" />;
    default: return <Wallet className="h-5 w-5" />;
  }
};

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: accounts } = await supabase.from("accounts").select("*");
  const { data: profile } = await supabase.from("profiles").select("id").eq("is_default", true).limit(1).maybeSingle();

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/settings" className="p-2 -ml-2 rounded-full hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
      </div>

      <div className="grid gap-3">
        {accounts?.map((acc) => (
          <div key={acc.id} className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                {getIconForType(acc.type)}
              </div>
              <div>
                <h3 className="font-semibold">{acc.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{acc.type}</p>
              </div>
            </div>
            <div className="text-right font-bold">
              ₹{Number(acc.current_balance).toFixed(2)}
            </div>
          </div>
        ))}
        {accounts?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No accounts found.</p>
        )}
      </div>

      <AddAccountForm profileId={profile?.id || ""} />
    </div>
  );
}
