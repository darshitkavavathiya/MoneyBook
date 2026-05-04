"use client";

import { ProfileSwitcher } from "./profile-switcher";
import { ThemeToggle } from "../theme-toggle";
import { Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface TopBarProps {
  profiles: Profile[];
}

export function TopBar({ profiles }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <ProfileSwitcher profiles={profiles} />
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" render={<Link href="/settings" />} nativeButton={false}>
          <Settings className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  );
}
