"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Users, 
  HandCoins, 
  PieChart 
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ArrowRightLeft,
  },
  {
    name: "Shared",
    href: "/shared",
    icon: Users,
  },
  {
    name: "Borrow",
    href: "/borrow-lend",
    icon: HandCoins,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: PieChart,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/80 px-2 backdrop-blur-md pb-safe">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
            <span className="text-[10px] font-medium leading-none">
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
