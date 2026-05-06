"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const PIN_COOKIE = "borrow_lend_unlocked";

/**
 * Sets or updates the user's 4-digit PIN.
 */
export async function setPin(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const pin = formData.get("pin") as string;

  if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
    throw new Error("PIN must be exactly 4 digits");
  }

  const { error } = await supabase
    .from("user_roles")
    .update({ pin_hash: pin })
    .eq("user_id", user.id);

  if (error) throw new Error("Failed to set PIN");

  revalidatePath("/settings");
}

/**
 * Verifies the user's PIN and sets a temporary unlock cookie.
 */
export async function verifyPin(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const pin = formData.get("pin") as string;

  const { data: roles } = await supabase
    .from("user_roles")
    .select("pin_hash")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!roles?.pin_hash) {
    throw new Error("No PIN configured. Please set a PIN in Settings first.");
  }

  if (roles.pin_hash !== pin) {
    throw new Error("Incorrect PIN");
  }

  // Set a temporary unlock cookie (15 minutes)
  const cookieStore = await cookies();
  cookieStore.set(PIN_COOKIE, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 minutes
    path: "/",
  });

  return { success: true };
}

/**
 * Check if the borrow/lend module is currently unlocked.
 */
export async function isBorrowLendUnlocked(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(PIN_COOKIE)?.value === "true";
}

/**
 * Check if the user has a PIN configured.
 */
export async function hasPinConfigured(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: roles } = await supabase
    .from("user_roles")
    .select("pin_hash")
    .eq("user_id", user.id)
    .maybeSingle();

  return !!roles?.pin_hash;
}
