"use client";

import * as React from "react";
import { addSharedExpense } from "@/app/actions/advanced";
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

interface AddSharedExpenseFormProps {
  payerProfileId: string;
}

export function AddSharedExpenseForm({ payerProfileId }: AddSharedExpenseFormProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  async function onSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await addSharedExpense(formData);
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" className="gap-1 rounded-full" />}>
        <Plus className="h-4 w-4" /> New
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[95%] rounded-2xl mx-auto p-4">
        <DialogHeader>
          <DialogTitle>Add Shared Expense</DialogTitle>
        </DialogHeader>
        
        <form action={onSubmit} className="space-y-4 pt-4">
          <input type="hidden" name="payer_profile_id" value={payerProfileId} />
          
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Title</label>
            <Input name="title" placeholder="e.g., Dinner at Cafe" required />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Amount (₹)</label>
            <Input type="number" step="0.01" name="amount" placeholder="500.00" required />
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Split Type</label>
            <Select name="split_type" required defaultValue="equal">
              <SelectTrigger>
                <SelectValue placeholder="Select split type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal">Split Equally</SelectItem>
                <SelectItem value="custom">Custom Split</SelectItem>
                <SelectItem value="percentage">By Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Date</label>
            <Input type="date" name="date" defaultValue={new Date().toISOString().split("T")[0]} required />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Shared Expense"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
