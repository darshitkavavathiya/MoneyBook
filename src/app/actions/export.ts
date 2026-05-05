"use server";

import { createClient } from "@/lib/supabase/server";
import * as XLSX from "xlsx";

export async function exportAllData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Check admin
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (roles?.role !== "admin") {
    throw new Error("Unauthorized: Admin only");
  }

  // Fetch all transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      id, 
      date, 
      amount, 
      type, 
      note, 
      account:accounts(name), 
      category:categories(name)
    `);

  // Transform data for excel
  const formattedData = transactions?.map(tx => ({
    ID: tx.id,
    Date: tx.date,
    Type: tx.type,
    // @ts-ignore
    Category: tx.category?.name || "",
    // @ts-ignore
    Account: tx.account?.name || "",
    Amount: tx.amount,
    Note: tx.note || ""
  })) || [];

  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  
  // Return base64 so client can download it
  return Buffer.from(excelBuffer).toString("base64");
}
