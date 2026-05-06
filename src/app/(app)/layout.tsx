import { BottomNav } from "@/components/layout/bottom-nav";
import { TopBar } from "@/components/layout/top-bar";
import { FastEntryModal } from "@/components/finance/fast-entry-modal";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveProfileId } from "@/app/actions/profile";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Get the active profile ID (from cookie or fallback to default)
  const activeProfileId = await getActiveProfileId();

  // Fetch user profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  // Fetch accounts and categories scoped to the active profile
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("profile_id", activeProfileId || "");

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("profile_id", activeProfileId || "");

  return (
    <div className="flex min-h-screen flex-col bg-background antialiased max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <TopBar profiles={profiles || []} activeProfileId={activeProfileId} />
      
      <main className="flex-1 overflow-y-auto pb-24 relative">
        {children}
      </main>

      <FastEntryModal 
        profiles={profiles || []} 
        categories={categories || []} 
        accounts={accounts || []} 
      />
      <BottomNav />
    </div>
  );
}

