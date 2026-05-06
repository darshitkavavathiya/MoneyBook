"use client";

import * as React from "react";
import { addBudget } from "@/app/actions/advanced";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Database } from "@/lib/supabase/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface AddBudgetFormProps {
  profileId: string;
  categories: Category[];
}

export function AddBudgetForm({ profileId, categories }: AddBudgetFormProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  async function onSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await addBudget(formData);
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  const expenseCategories = categories.filter(c => c.type === "expense");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full" />}>
        <Plus className="mr-2 h-4 w-4" /> Set New Budget
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[95%] rounded-2xl mx-auto p-4">
        <DialogHeader>
          <DialogTitle>Set Monthly Budget</DialogTitle>
        </DialogHeader>
        
        <form action={onSubmit} className="space-y-4 pt-4">
          <input type="hidden" name="profile_id" value={profileId} />
          
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Month</label>
            <Input type="month" name="month" defaultValue={currentMonth} required />
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Category</label>
            <Select name="category_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
                {expenseCategories.length === 0 && (
                  <SelectItem value="" disabled>No expense categories found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Limit Amount (₹)</label>
            <Input type="number" step="0.01" name="limit_amount" placeholder="5000.00" required />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Budget"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
