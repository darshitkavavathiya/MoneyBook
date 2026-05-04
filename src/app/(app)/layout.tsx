import { BottomNav } from "@/components/layout/bottom-nav";
import { TopBar } from "@/components/layout/top-bar";
import { FastEntryModal } from "@/components/finance/fast-entry-modal";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

  // Fetch user profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  // Fetch accounts and categories for the modal
  // Ideally, this should be fetched per-profile, but we'll fetch all for now
  // and let the client filter or just use the default profile's data.
  const { data: categories } = await supabase.from("categories").select("*");
  const { data: accounts } = await supabase.from("accounts").select("*");

  return (
    <div className="flex min-h-screen flex-col bg-background antialiased max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <TopBar profiles={profiles || []} />
      
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
