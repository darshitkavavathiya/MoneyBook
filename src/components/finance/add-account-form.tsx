"use client";

import * as React from "react";
import { addAccount } from "@/app/actions/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Loader2 } from "lucide-react";

interface AddAccountFormProps {
  profileId: string;
}

export function AddAccountForm({ profileId }: AddAccountFormProps) {
  const [type, setType] = React.useState("Bank");
  const [isPending, setIsPending] = React.useState(false);

  async function onSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await addAccount(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
      setType("Bank");
    }
  }

  return (
    <div className="pt-6 border-t">
      <h2 className="text-lg font-semibold mb-4">Add New Account</h2>
      <form action={onSubmit} className="space-y-4">
        <input type="hidden" name="profile_id" value={profileId} />
        
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Account Name</label>
          <Input name="name" placeholder="e.g., HDFC Salary" required />
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Type</label>
          <Select name="type" required value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Bank">Bank Account</SelectItem>
              <SelectItem value="UPI">UPI / Wallet</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Initial Balance (₹)</label>
          <Input type="number" step="0.01" name="balance" defaultValue="0.00" required />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </div>
  );
}
