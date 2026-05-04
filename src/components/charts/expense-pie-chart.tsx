"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = [
  "hsl(0, 84%, 60%)",
  "hsl(25, 95%, 53%)",
  "hsl(45, 93%, 47%)",
  "hsl(142, 71%, 45%)",
  "hsl(199, 89%, 48%)",
  "hsl(262, 83%, 58%)",
  "hsl(330, 81%, 60%)",
  "hsl(172, 66%, 50%)",
  "hsl(210, 40%, 50%)",
  "hsl(350, 89%, 60%)",
];

interface CategoryData {
  name: string;
  value: number;
}

export function ExpensePieChart({ data }: { data: CategoryData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-sm text-muted-foreground">
        No expense data to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
          stroke="none"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, "Amount"]}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid hsl(var(--border))",
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            fontSize: "13px",
          }}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
