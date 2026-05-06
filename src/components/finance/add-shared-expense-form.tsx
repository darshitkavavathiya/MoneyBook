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
import { Loader2, Plus, Users } from "lucide-react";
import { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AddSharedExpenseFormProps {
  payerProfileId: string;
  profiles: Profile[];
}

export function AddSharedExpenseForm({ payerProfileId, profiles }: AddSharedExpenseFormProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [selectedParticipants, setSelectedParticipants] = React.useState<string[]>([]);

  // Other profiles (not the current payer)
  const otherProfiles = profiles.filter(p => p.id !== payerProfileId);

  function toggleParticipant(profileId: string) {
    setSelectedParticipants(prev =>
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  }

  async function onSubmit(formData: FormData) {
    setIsPending(true);
    try {
      // Append selected participant IDs as a JSON string
      formData.set("participant_ids", JSON.stringify(selectedParticipants));
      await addSharedExpense(formData);
      setOpen(false);
      setSelectedParticipants([]);
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

          {/* Participant Selection */}
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-2 block">
              <Users className="h-3 w-3 inline mr-1" />
              Split with ({selectedParticipants.length} selected)
            </label>
            {otherProfiles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {otherProfiles.map(profile => {
                  const isSelected = selectedParticipants.includes(profile.id);
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => toggleParticipant(profile.id)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-border hover:bg-accent'
                      }`}
                    >
                      {profile.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No other profiles available. Create additional profiles to split expenses.</p>
            )}
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
