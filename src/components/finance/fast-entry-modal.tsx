"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "@/lib/supabase/database.types";
import { addTransaction } from "@/app/actions/finance";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type Account = Database["public"]["Tables"]["accounts"]["Row"];

interface FastEntryModalProps {
  profiles: Profile[];
  categories: Category[];
  accounts: Account[];
}

export function FastEntryModal({ profiles, categories, accounts }: FastEntryModalProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const activeProfile = profiles.length > 0 ? profiles[0] : null;

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  async function onSubmit(formData: FormData) {
    if (!activeProfile) {
      console.error("No active profile found");
      return;
    }
    setIsPending(true);
    formData.append("profile_id", activeProfile.id);
    try {
      await addTransaction(formData);
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="fixed bottom-20 right-4 z-50">
        <DialogTrigger render={<Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
          />}>
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Transaction</span>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-md w-[95%] rounded-2xl mx-auto mb-20 md:mb-auto md:top-[50%] md:translate-y-[-50%] p-4">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="expense" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="expense" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">Expense</TabsTrigger>
            <TabsTrigger value="income" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Income</TabsTrigger>
          </TabsList>

          <TabsContent value="expense">
            <form action={onSubmit} className="space-y-4">
              <input type="hidden" name="type" value="expense" />
              
              <div>
                <label className="text-xs text-muted-foreground font-medium">Amount</label>
                <Input type="number" step="0.01" name="amount" placeholder="0.00" required className="text-2xl h-12" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Category</label>
                  <Select name="category_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Account</label>
                  <Select name="account_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((a) => (
                        <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Date</label>
                  <Input type="date" name="date" defaultValue={new Date().toISOString().split("T")[0]} required />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Note</label>
                  <Input type="text" name="note" placeholder="Optional" />
                </div>
              </div>

              <Button type="submit" className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isPending}>
                {isPending ? "Saving..." : "Save Expense"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="income">
            <form action={onSubmit} className="space-y-4">
              <input type="hidden" name="type" value="income" />
              
              <div>
                <label className="text-xs text-muted-foreground font-medium">Amount</label>
                <Input type="number" step="0.01" name="amount" placeholder="0.00" required className="text-2xl h-12" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Category</label>
                  <Select name="category_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeCategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Account</label>
                  <Select name="account_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((a) => (
                        <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Date</label>
                  <Input type="date" name="date" defaultValue={new Date().toISOString().split("T")[0]} required />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Note</label>
                  <Input type="text" name="note" placeholder="Optional" />
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isPending}>
                {isPending ? "Saving..." : "Save Income"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
