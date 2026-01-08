// src/components/admin/dashboard/ReviewModal.jsx
import { Download, FileText, X } from "lucide-react";
import { useState } from "react";
import BASE_URL from "../../../config/api";
import PaymentModeBadge from "./badges/PaymentModeBadge";

const formatIST = (date) =>
  date
    ? new Date(date).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

export default function ReviewModal({ plan, onClose, fetchUsers, currentPage, limit }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const updatePlan = async (status, reason = "") => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/plan/update/${plan.user._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status.toLowerCase(), adminComment: reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Update failed");
      fetchUsers(currentPage, limit);
      onClose();
    } catch (err) {
      alert("Failed to update: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url, label) => {
    if (!url) return alert("Document not available");
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = label;
    link.click();
  };

  const status = plan.status?.toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 border-b bg-slate-50">
          <h3 className="font-semibold text-lg">Review Submission – {plan.user?.name}</h3>
          <button onClick={onClose} disabled={loading}>
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 text-sm space-y-3">
          {/* User & Plan info */}
          <p><span className="text-slate-500">Member ID:</span> <strong>{plan.user?.memId}</strong></p>
          <p><span className="text-slate-500">Email:</span> {plan.user?.email}</p>
          <p><span className="text-slate-500">Phone:</span> {plan.user?.mobno}</p>
          <p><span className="text-slate-500">Plan:</span> {plan.plan_name?.toUpperCase()}</p>
          <p><span className="text-slate-500">Payment Mode:</span> <PaymentModeBadge mode={plan.payment_mode} /></p>
          <p><span className="text-slate-500">Submitted:</span> {formatIST(plan.createdAt)}</p>

          <div className="mt-4">
            <p className="font-medium mb-2">Payment Screenshot:</p>
            {plan.payment_ss ? (
              <div className="flex justify-between items-center bg-slate-50 border rounded-md px-3 py-2">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-blue-600" />
                  Payment Proof ({plan.payment_mode?.toUpperCase()})
                </div>
                <button
                  onClick={() => handleDownload(plan.payment_ss, `${plan.user?.memId}-payment-proof`)}
                  className="text-blue-600 text-xs flex items-center gap-1"
                >
                  <Download size={12} /> Download
                </button>
              </div>
            ) : (
              <p className="text-rose-600 italic text-xs">No screenshot uploaded</p>
            )}
          </div>

          {status === "pending" && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Reason for rejection (optional)"
              className="w-full mt-4 border rounded-md p-3 text-sm resize-none"
              disabled={loading}
            />
          )}
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t bg-slate-50">
          {status === "pending" ? (
            <>
              <button
                onClick={() => updatePlan("rejected", reason)}
                disabled={loading}
                className="px-5 py-2 bg-rose-600 text-white rounded-md text-sm hover:bg-rose-700 disabled:opacity-50"
              >
                {loading ? "Rejecting..." : "Reject"}
              </button>
              <button
                onClick={() => updatePlan("approved")}
                disabled={loading}
                className="px-5 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Approving..." : "Approve"}
              </button>
            </>
          ) : (
            <button onClick={onClose} className="px-5 py-2 bg-slate-300 rounded-md text-sm">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}