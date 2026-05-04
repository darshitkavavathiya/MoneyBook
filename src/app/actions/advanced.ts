"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addSharedExpense(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const payerProfileId = formData.get("payer_profile_id") as string;
  const title = formData.get("title") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const splitType = formData.get("split_type") as string || "equal";
  const date = formData.get("date") as string || new Date().toISOString();

  // Insert shared expense
  const { data: expense, error } = await supabase
    .from("shared_expenses")
    .insert({
      payer_profile_id: payerProfileId,
      title,
      amount,
      split_type: splitType,
      date,
    })
    .select()
    .single();

  if (error || !expense) throw new Error("Failed to add shared expense");

  // In a real app, we'd parse participant IDs and amounts.
  // For simplicity here, we assume it's just recorded as an expense 
  // and participants can be added later or via a more complex form.

  revalidatePath("/shared");
}

export async function addSettlement(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const fromProfileId = formData.get("from_profile_id") as string;
  const toProfileId = formData.get("to_profile_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const date = formData.get("date") as string || new Date().toISOString();

  const { error } = await supabase
    .from("settlements")
    .insert({
      from_profile_id: fromProfileId,
      to_profile_id: toProfileId,
      amount,
      date,
    });

  if (error) throw new Error("Failed to add settlement");

  revalidatePath("/shared");
}

export async function addBorrowLend(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const profileId = formData.get("profile_id") as string;
  const personName = formData.get("person_name") as string;
  const type = formData.get("type") as string; // 'borrowed' or 'lent'
  const amount = parseFloat(formData.get("amount") as string);
  const note = formData.get("note") as string;
  const date = formData.get("date") as string || new Date().toISOString();

  const { error } = await supabase
    .from("borrow_lend")
    .insert({
      profile_id: profileId,
      person_name: personName,
      type,
      amount,
      note,
      date,
    });

  if (error) throw new Error("Failed to add borrow/lend record");

  revalidatePath("/borrow-lend");
}

export async function addBudget(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const profileId = formData.get("profile_id") as string;
  const categoryId = formData.get("category_id") as string;
  const limitAmount = parseFloat(formData.get("limit_amount") as string);
  const month = formData.get("month") as string; // format YYYY-MM

  const { error } = await supabase
    .from("budgets")
    .insert({
      profile_id: profileId,
      category_id: categoryId,
      limit_amount: limitAmount,
      month,
    });

  if (error) throw new Error("Failed to add budget");

  revalidatePath("/settings/budgets");
}

export async function addPolicy(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const profileId = formData.get("profile_id") as string;
  const title = formData.get("title") as string;
  const providerName = formData.get("provider_name") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const date = formData.get("date") as string;
  const note = formData.get("note") as string;

  const { error } = await supabase
    .from("policy_dashboard")
    .insert({
      profile_id: profileId,
      title,
      provider_name: providerName,
      amount,
      date,
      note,
    });

  if (error) throw new Error("Failed to add policy");

  revalidatePath("/policies");
}
