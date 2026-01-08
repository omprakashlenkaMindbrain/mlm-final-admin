// src/components/admin/dashboard/badges/PaymentModeBadge.jsx
import { CreditCard } from "lucide-react";

export default function PaymentModeBadge({ mode }) {
  const isUPI = mode?.toLowerCase() === "upi";
  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
        isUPI ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
      }`}
    >
      <CreditCard size={13} />
      {isUPI ? "UPI" : mode?.toUpperCase() || "N/A"}
    </div>
  );
}