import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6">
      <main className="flex max-w-md flex-col items-center gap-8 text-center">
        {/* Logo / Icon */}
        <div className="flex size-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <Wallet className="size-10" />
        </div>

        {/* App Name & Tagline */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">MoneyBook</h1>
          <p className="text-lg text-muted-foreground">
            Track every rupee. Split expenses with friends. Stay in control of
            your finances.
          </p>
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className="gap-2 rounded-full px-8"
          render={<a href="/login" />}
          nativeButton={false}
        >
          Get Started
          <ArrowRight className="size-4" />
        </Button>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          {[
            "Multi-profile",
            "Split Expenses",
            "Budget Tracking",
            "Dark Mode",
            "PWA",
          ].map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-border px-3 py-1"
            >
              {feature}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
