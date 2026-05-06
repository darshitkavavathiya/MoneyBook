"use client";

import * as React from "react";
import { Check, ChevronsUpDown, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Database } from "@/lib/supabase/database.types";
import { setActiveProfile } from "@/app/actions/profile";
import { useRouter } from "next/navigation";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileSwitcherProps {
  profiles: Profile[];
  activeProfileId: string | null;
}

export function ProfileSwitcher({ profiles, activeProfileId }: ProfileSwitcherProps) {
  const router = useRouter();
  const fallbackProfile = { id: "0", name: "No Profile", is_default: false };
  const currentProfile = profiles.find((p) => p.id === activeProfileId)
    || profiles.find((p) => p.is_default)
    || profiles[0]
    || fallbackProfile;

  async function handleSwitch(profileId: string) {
    await setActiveProfile(profileId);
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button
          variant="outline"
          role="combobox"
          className="w-[160px] justify-between h-9 px-3"
        />
      }>
        <div className="flex items-center gap-2 truncate">
          <UserCircle2 className="h-4 w-4 text-primary" />
          <span className="truncate text-sm font-medium">
            {currentProfile.name}
          </span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[160px]">
        <div className="px-2 py-1.5 text-xs text-muted-foreground font-semibold">
          Finance Profiles
        </div>
        <DropdownMenuSeparator />
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <DropdownMenuItem
              key={profile.id}
              onClick={() => handleSwitch(profile.id)}
              className="flex items-center justify-between"
            >
              <span className="truncate">{profile.name}</span>
              {currentProfile.id === profile.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="text-muted-foreground text-xs">
            No profiles found
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-primary font-medium">
          + Create Profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
