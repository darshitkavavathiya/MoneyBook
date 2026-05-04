"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MonthlyData {
  name: string;
  income: number;
  expense: number;
}

export function IncomeExpenseBarChart({ data }: { data: MonthlyData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-sm text-muted-foreground">
        No data to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--accent))", opacity: 0.4 }}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid hsl(var(--border))",
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            fontSize: "13px",
          }}
          formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, ""]}
        />
        <Legend
          verticalAlign="top"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
        />
        <Bar dataKey="income" name="Income" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
        <Bar dataKey="expense" name="Expense" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
