import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  iconColor?: string;
  iconBg?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconColor = "text-brand-500",
  iconBg = "bg-brand-50",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center gap-3">
      <div className={`${iconBg} p-2.5 rounded-xl shrink-0`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-stone-400 leading-none mb-1">{label}</p>
        <p className="text-lg font-bold text-stone-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
