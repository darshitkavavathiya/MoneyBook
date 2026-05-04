"use client";

import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Login error:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6">
      <main className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        {/* Logo / Icon */}
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <Wallet className="size-8" />
        </div>

        {/* Header */}
        <div className="space-y-2 w-full">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue to MoneyBook
          </p>
        </div>

        {/* Login Form */}
        <div className="w-full space-y-4">
          <Button
            size="lg"
            variant="outline"
            className="w-full relative bg-card hover:bg-accent"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-pulse">Connecting...</span>
            ) : (
              <>
                <svg
                  className="absolute left-4 size-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-4 px-8">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </main>
    </div>
  );
}
