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
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-area-inset-bottom">
      <div className="bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-2xl shadow-slate-200/60">
        <div className="max-w-md mx-auto flex px-2 py-1">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/traveller" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 relative"
              >
                <div className={`w-10 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-br from-indigo-100 to-sky-100"
                    : ""
                }`}>
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${active ? "text-indigo-600" : "text-slate-500"}`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </div>
                <span className={`text-[10px] font-bold transition-colors duration-200 ${active ? "text-indigo-600" : "text-slate-500"}`}>
                  {label}
                </span>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-sky-400" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
