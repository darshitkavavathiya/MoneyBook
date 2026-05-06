"use client";

import * as React from "react";
import { addCategory } from "@/app/actions/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface AddCategoryFormProps {
  profileId: string;
}

export function AddCategoryForm({ profileId }: AddCategoryFormProps) {
  const [type, setType] = React.useState("expense");
  const [isPending, setIsPending] = React.useState(false);

  async function onSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await addCategory(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
      setType("expense");
    }
  }

  return (
    <div className="pt-6 border-t">
      <h2 className="text-lg font-semibold mb-4">Add Custom Category</h2>
      <form action={onSubmit} className="space-y-4">
        <input type="hidden" name="profile_id" value={profileId} />
        
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Category Name</label>
          <Input name="name" placeholder="e.g., Subscriptions" required />
        </div>
        
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Type</label>
          <Select name="type" required value={type} onValueChange={(val) => val && setType(val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Category"
          )}
        </Button>
      </form>
    </div>
  );
}
