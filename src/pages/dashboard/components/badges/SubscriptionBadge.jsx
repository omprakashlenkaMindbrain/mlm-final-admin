// src/components/admin/dashboard/badges/SubscriptionBadge.jsx
import { Award, Sparkles, Star } from "lucide-react";

export default function SubscriptionBadge({ plan }) {
  const configMap = {
    ibo: { icon: <Award size={16} />, bg: "#64748b" },
    "silver ibo": { icon: <Sparkles size={16} />, bg: "#e5e7eb", color: "#374151" },
    "gold ibo": { icon: <Star size={16} />, bg: "#f59e0b" },
    "star ibo": { icon: <Star size={16} />, bg: "#2563eb" },
  };

  const normalized = plan?.toLowerCase();
  const config = configMap[normalized] || { icon: null, bg: "#f3f4f6", color: "#6b7280" };

  return (
    <div
      className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium text-white"
      style={{ backgroundColor: config.bg, color: config.color || "white" }}
    >
      {config.icon}
      {plan ? plan.toUpperCase() : "Unknown Plan"}
    </div>
  );
}