import { createClient } from "@/lib/supabase/server";
import { addAccount } from "@/app/actions/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Wallet, CreditCard, Smartphone } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const getIconForType = (type: string) => {
  switch (type) {
    case "cash": return <Wallet className="h-5 w-5" />;
    case "bank": return <Building2 className="h-5 w-5" />;
    case "upi": return <Smartphone className="h-5 w-5" />;
    case "credit_card": return <CreditCard className="h-5 w-5" />;
    default: return <Wallet className="h-5 w-5" />;
  }
};

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: accounts } = await supabase.from("accounts").select("*");
  const { data: profiles } = await supabase.from("profiles").select("id").eq("is_default", true).single();

  const activeProfileId = profiles?.id;

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
                <p className="text-xs text-muted-foreground capitalize">{acc.type.replace("_", " ")}</p>
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

      <div className="pt-6 border-t">
        <h2 className="text-lg font-semibold mb-4">Add New Account</h2>
        <form action={addAccount} className="space-y-4">
          <input type="hidden" name="profile_id" value={activeProfileId} />
          
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Account Name</label>
            <Input name="name" placeholder="e.g., HDFC Salary" required />
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Type</label>
            <Select name="type" required defaultValue="bank">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank Account</SelectItem>
                <SelectItem value="upi">UPI / Wallet</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Initial Balance (₹)</label>
            <Input type="number" step="0.01" name="balance" defaultValue="0.00" required />
          </div>

          <Button type="submit" className="w-full">Create Account</Button>
        </form>
      </div>
    </div>
  );
}
