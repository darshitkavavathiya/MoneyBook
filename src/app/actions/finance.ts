"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const profileId = formData.get("profile_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as "income" | "expense";
  const categoryId = formData.get("category_id") as string;
  const accountId = formData.get("account_id") as string;
  const date = formData.get("date") as string;
  const note = formData.get("note") as string;

  // 1. Insert the transaction record
  const { error: txError } = await supabase
    .from("transactions")
    .insert({
      profile_id: profileId,
      amount: amount,
      type: type,
      category_id: categoryId,
      account_id: accountId,
      date: date,
      note: note,
    });

  if (txError) {
    console.error("Error adding transaction:", txError);
    throw new Error("Failed to add transaction");
  }

  // 2. Update the account's current_balance
  const { data: account } = await supabase
    .from("accounts")
    .select("current_balance")
    .eq("id", accountId)
    .single();

  if (account) {
    const currentBalance = Number(account.current_balance);
    const newBalance = type === "income"
      ? currentBalance + amount
      : currentBalance - amount;

    await supabase
      .from("accounts")
      .update({ current_balance: newBalance })
      .eq("id", accountId);
  }

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/settings/accounts");
  revalidatePath("/settings/budgets");
}

export async function addAccount(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const profileId = formData.get("profile_id") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const balance = parseFloat(formData.get("balance") as string);

  const { error } = await supabase
    .from("accounts")
    .insert({
      profile_id: profileId,
      name,
      type,
      current_balance: balance,
    });

  if (error) {
    console.error("Error adding account:", error);
    throw new Error("Failed to add account");
  }

  revalidatePath("/settings/accounts");
  revalidatePath("/dashboard");
}

export async function addCategory(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const profileId = formData.get("profile_id") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as "income" | "expense";

  const { error } = await supabase
    .from("categories")
    .insert({
      profile_id: profileId,
      name,
      type,
    });

  if (error) {
    console.error("Error adding category:", error);
    throw new Error("Failed to add category");
  }

  revalidatePath("/settings/categories");
}
