"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, CalendarDays, UserCircle } from "lucide-react";

const NAV = [
  { href: "/traveller",          icon: Compass,       label: "Explore" },
  { href: "/traveller/bookings", icon: CalendarDays,  label: "Bookings" },
  { href: "/traveller/profile",  icon: UserCircle,    label: "Profile" },
];

export default function TravellerBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-blue-900 border-t border-blue-800 safe-area-inset-bottom">
      <div className="max-w-md mx-auto flex">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/traveller" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                active ? "text-white" : "text-blue-400 hover:text-blue-200"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
