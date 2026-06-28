import { Car, Star, Clock, Zap } from "lucide-react";

interface QuickStatsProps {
  totalTrips: number;
  rating: number;
  hoursOnline?: number;
  acceptanceRate?: number;
}

export default function QuickStats({
  totalTrips,
  rating,
  hoursOnline = 5.5,
  acceptanceRate = 92,
}: QuickStatsProps) {
  const stats = [
    {
      icon: Car,
      label: "Total Trips",
      value: totalTrips.toLocaleString(),
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Star,
      label: "Rating",
      value: rating.toFixed(2),
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      icon: Clock,
      label: "Hrs Online",
      value: `${hoursOnline}h`,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      icon: Zap,
      label: "Acceptance",
      value: `${acceptanceRate}%`,
      color: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value, color, bg }) => (
        <div
          key={label}
          className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center gap-1.5"
        >
          <div className={`${bg} p-2 rounded-xl`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <p className="text-sm font-bold text-gray-800 leading-none">{value}</p>
          <p className="text-[10px] text-gray-400 text-center leading-tight">{label}</p>
        </div>
      ))}
    </div>
  );
}
