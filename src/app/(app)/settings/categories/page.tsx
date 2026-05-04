import { createClient } from "@/lib/supabase/server";
import { addCategory } from "@/app/actions/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tags, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: categories } = await supabase.from("categories").select("*").order('type');
  const { data: profiles } = await supabase.from("profiles").select("id").eq("is_default", true).single();

  const activeProfileId = profiles?.id;

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

      <div className="pt-6 border-t">
        <h2 className="text-lg font-semibold mb-4">Add Custom Category</h2>
        <form action={addCategory} className="space-y-4">
          <input type="hidden" name="profile_id" value={activeProfileId} />
          
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Category Name</label>
            <Input name="name" placeholder="e.g., Subscriptions" required />
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Type</label>
            <Select name="type" required defaultValue="expense">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">Create Category</Button>
        </form>
      </div>
    </div>
  );
}
