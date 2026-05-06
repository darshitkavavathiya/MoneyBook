import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { getActiveProfileId } from "@/app/actions/profile";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profileId = await getActiveProfileId();

  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      category:categories(name, type)
    `)
    .eq("profile_id", profileId || "")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 space-y-6 pb-20">
      <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
      
      <div className="space-y-4">
        {transactions?.map((t) => {
          // @ts-ignore - Supabase type generation doesn't strongly type joined tables yet
          const categoryName = t.category?.name || "Uncategorized";
          // @ts-ignore
          const categoryType = t.category?.type || "expense";
          const isIncome = categoryType === "income";

          return (
            <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm">
              <div>
                <h3 className="font-semibold">{categoryName}</h3>
                <p className="text-xs text-muted-foreground">{format(new Date(t.date), "MMM dd, yyyy")}</p>
                {t.note && <p className="text-xs text-muted-foreground mt-1">{t.note}</p>}
              </div>
              <div className={`text-right font-bold ${isIncome ? 'text-green-600' : ''}`}>
                {isIncome ? '+' : '-'}₹{Number(t.amount).toFixed(2)}
              </div>
            </div>
          );
        })}

        {transactions?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No transactions found.</p>
        )}
      </div>
    </div>
  );
}
