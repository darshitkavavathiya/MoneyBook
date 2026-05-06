"use client";

import * as React from "react";
import { verifyPin } from "@/app/actions/pin";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function PinLockScreen() {
  const router = useRouter();
  const [pin, setPin] = React.useState(["", "", "", ""]);
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newPin = [...pin];
    newPin[index] = value.slice(-1); // Take only the last digit
    setPin(newPin);
    setError(null);

    // Auto-focus next input
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
    if (pinString.length !== 4) {
      setError("Please enter all 4 digits");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("pin", pinString);
      await verifyPin(formData);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect PIN");
      setPin(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 space-y-6">
      <div className="p-6 bg-primary/10 rounded-full">
        <Lock className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-center">PIN Protected Area</h1>
      <p className="text-center text-muted-foreground text-sm max-w-[250px]">
        Enter your 4-digit PIN to access your Borrow & Lend records.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-xs">
        <div className="flex gap-3 justify-center w-full">
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
              className="w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold bg-card shadow-sm text-center focus:border-primary focus:outline-none transition-colors"
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" className="w-full mt-2" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Unlock"
          )}
        </Button>
      </form>
    </div>
  );
}
