"use client";

import * as React from "react";
import { addBorrowLend } from "@/app/actions/advanced";
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

interface AddBorrowLendFormProps {
  profileId: string;
}

export function AddBorrowLendForm({ profileId }: AddBorrowLendFormProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  async function onSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await addBorrowLend(formData);
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
          <DialogTitle>Add Borrow/Lend Record</DialogTitle>
        </DialogHeader>
        
        <form action={onSubmit} className="space-y-4 pt-4">
          <input type="hidden" name="profile_id" value={profileId} />
          
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Type</label>
            <Select name="type" required defaultValue="lent">
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lent">I Lent (To Collect)</SelectItem>
                <SelectItem value="borrowed">I Borrowed (To Pay)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Person Name</label>
            <Input name="person_name" placeholder="e.g., John Doe" required />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Amount (₹)</label>
            <Input type="number" step="0.01" name="amount" placeholder="1000.00" required />
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Date</label>
            <Input type="date" name="date" defaultValue={new Date().toISOString().split("T")[0]} required />
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Note (Optional)</label>
            <Input type="text" name="note" placeholder="Optional details..." />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Record"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
