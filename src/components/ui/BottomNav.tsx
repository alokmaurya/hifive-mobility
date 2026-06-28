"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, CalendarCheck, TrendingUp, UserCircle } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home",     icon: LayoutDashboard },
  { href: "/tours",     label: "My Tours", icon: Map },
  { href: "/bookings",  label: "Bookings", icon: CalendarCheck },
  { href: "/earnings",  label: "Earnings", icon: TrendingUp },
  { href: "/profile",   label: "Profile",  icon: UserCircle },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around px-1 pt-1 pb-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors ${
                isActive ? "text-brand-500" : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
