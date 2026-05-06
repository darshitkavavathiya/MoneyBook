"use client";

import * as React from "react";
import { setPin } from "@/app/actions/pin";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Check } from "lucide-react";

interface SetPinFormProps {
  hasExistingPin: boolean;
}

export function SetPinForm({ hasExistingPin }: SetPinFormProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [pin, setLocalPin] = React.useState(["", "", "", ""]);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setLocalPin(newPin);
    setSuccess(false);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pinString = pin.join("");
    if (pinString.length !== 4) return;

    setIsPending(true);
    try {
      const formData = new FormData();
      formData.set("pin", pinString);
      await setPin(formData);
      setSuccess(true);
      setLocalPin(["", "", "", ""]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-primary" />
        <h3 className="font-medium">Borrow & Lend PIN</h3>
      </div>
      <p className="text-xs text-muted-foreground">
        {hasExistingPin ? "Update your 4-digit PIN for the Borrow & Lend module." : "Set a 4-digit PIN to protect your Borrow & Lend records."}
      </p>
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex gap-2">
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-10 h-10 rounded-lg border-2 text-lg font-bold bg-background text-center focus:border-primary focus:outline-none transition-colors"
            />
          ))}
        </div>
        <Button type="submit" size="sm" disabled={isPending || pin.join("").length !== 4}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : success ? (
            <Check className="h-4 w-4" />
          ) : (
            hasExistingPin ? "Update" : "Set PIN"
          )}
        </Button>
      </form>
      {success && (
        <p className="text-xs text-green-600 font-medium">PIN saved successfully!</p>
      )}
    </div>
  );
}
