import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AddCategoryForm } from "@/components/finance/add-category-form";
import { getActiveProfileId } from "@/app/actions/profile";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: categories } = await supabase.from("categories").select("*").order('type');
  const activeProfileId = await getActiveProfileId();

  const incomeCategories = categories?.filter(c => c.type === "income") || [];
  const expenseCategories = categories?.filter(c => c.type === "expense") || [];

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/settings" className="p-2 -ml-2 rounded-full hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Expenses</h2>
          <div className="flex flex-wrap gap-2">
            {expenseCategories.map((cat) => (
              <span key={cat.id} className="px-3 py-1 bg-destructive/10 text-destructive text-sm rounded-full border border-destructive/20 flex items-center gap-1">
                {cat.name}
              </span>
            ))}
            {expenseCategories.length === 0 && <span className="text-sm text-muted-foreground">None</span>}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Income</h2>
          <div className="flex flex-wrap gap-2">
            {incomeCategories.map((cat) => (
              <span key={cat.id} className="px-3 py-1 bg-green-500/10 text-green-600 text-sm rounded-full border border-green-500/20 flex items-center gap-1">
                {cat.name}
              </span>
            ))}
            {incomeCategories.length === 0 && <span className="text-sm text-muted-foreground">None</span>}
          </div>
        </div>
      </div>

      <AddCategoryForm profileId={activeProfileId || ""} />
    </div>
  );
}
