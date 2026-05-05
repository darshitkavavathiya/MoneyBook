import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldAlert, User as UserIcon } from "lucide-react";
import Link from "next/link";

import { ExportButton } from "@/components/admin/export-button";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check if admin
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user?.id || "")
    .maybeSingle();

  const isAdmin = roles?.role === "admin";

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      
      {/* User Profile Summary */}
      <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <UserIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h2 className="truncate text-lg font-semibold leading-tight">
            {user?.user_metadata?.full_name || "Finance User"}
          </h2>
          <p className="truncate text-sm text-muted-foreground">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Admin Section */}
      {isAdmin && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            <h3 className="font-semibold">Admin Area</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            You have administrator privileges.
          </p>
          <ExportButton />
        </div>
      )}

      {/* App Preferences */}
      <div className="space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
          Preferences & Data
        </h3>
        <div className="rounded-xl border bg-card shadow-sm divide-y">
          <Link href="/settings/accounts" className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
            <span className="font-medium">Accounts</span>
            <span className="text-muted-foreground text-sm">Manage</span>
          </Link>
          <Link href="/settings/categories" className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
            <span className="font-medium">Categories</span>
            <span className="text-muted-foreground text-sm">Manage</span>
          </Link>
          <Link href="/settings/budgets" className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
            <span className="font-medium">Budgets</span>
            <span className="text-muted-foreground text-sm">Limits</span>
          </Link>
          <Link href="/policies" className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
            <span className="font-medium">Policies</span>
            <span className="text-muted-foreground text-sm">Insurance</span>
          </Link>
          <div className="p-4 flex items-center justify-between">
            <span>Dark Mode</span>
            <span className="text-muted-foreground text-sm">Toggle in header</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span>Currency</span>
            <span className="text-muted-foreground font-medium">INR (₹)</span>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="pt-4">
        <form action={signOut}>
          <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive" type="submit">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
