// src/components/admin/dashboard/badges/StatusBadge.jsx
import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function StatusBadge({ status = "pending", reason }) {
  const config = {
    approved: { icon: <CheckCircle size={14} />, bg: "#10b981", label: "Approved" },
    pending: { icon: <Clock size={14} />, bg: "#f59e0b", label: "Pending" },
    rejected: { icon: <XCircle size={14} />, bg: "#dc2626", label: "Rejected" },
  }[status?.toLowerCase()] || { icon: <Clock size={14} />, bg: "#f59e0b", label: "Pending" };

  return (
    <div>
      <div
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-white"
        style={{ backgroundColor: config.bg }}
      >
        {config.icon}
        {config.label}
      </div>
      {reason && <p className="text-[11px] text-red-600 italic mt-1">{reason}</p>}
    </div>
  );
}