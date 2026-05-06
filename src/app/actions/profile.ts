"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ACTIVE_PROFILE_COOKIE = "activeProfileId";

/**
 * Sets the active profile by storing its ID in a cookie.
 */
export async function setActiveProfile(profileId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_PROFILE_COOKIE, profileId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });

  revalidatePath("/", "layout");
}

/**
 * Gets the active profile ID. Checks the cookie first,
 * then falls back to the user's default profile.
 */
export async function getActiveProfileId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ACTIVE_PROFILE_COOKIE)?.value;

  if (cookieValue) {
    return cookieValue;
  }

  // Fallback: fetch the default profile from the database
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("is_default", true)
    .limit(1)
    .maybeSingle();

  return profile?.id || null;
}
