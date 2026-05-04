"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FastEntryButton() {
  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
        onClick={() => {
          // TODO: Open transaction entry modal
          console.log("Open fast entry");
        }}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add Transaction</span>
      </Button>
    </div>
  );
}
