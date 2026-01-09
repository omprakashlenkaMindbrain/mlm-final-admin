import { X } from "lucide-react";
import { useUserPayoutHistory } from "../../../hooks/payouthistory/getPayoutHistory";

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

const StatusBadge = ({ status }) => {
  const base = "px-2.5 py-1 rounded-full text-xs font-medium";
  if (status === "approved")
    return <span className={`${base} bg-green-100 text-green-700`}>Approved</span>;
  if (status === "rejected")
    return <span className={`${base} bg-rose-100 text-rose-700`}>Rejected</span>;
  return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
};

function PayoutHistoryModal({ user, onClose }) {
  const { payouts, loading, error } = useUserPayoutHistory(user._id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-3 border-b bg-slate-50">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">
              Payout History
            </h3>
            <p className="text-sm text-slate-500">
              {user.name} • {user.email}
            </p>
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-5 py-4 max-h-[65vh] overflow-y-auto">
          {loading && (
            <div className="py-10 text-center text-slate-500">
              Loading payout history...
            </div>
          )}

          {error && (
            <div className="py-10 text-center text-rose-600">
              {error}
            </div>
          )}

          {!loading && payouts.length === 0 && (
            <div className="py-10 text-center text-slate-500">
              No payout history found
            </div>
          )}

          {!loading && payouts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm divide-y divide-slate-200">
                <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 text-left">Amount</th>
                    <th className="px-5 py-3 text-left">Remark</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {payouts.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        ₹{p.payoutAmount}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {p.remark || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs">
                        {formatIST(p.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-5 py-4 border-t bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-300 rounded-md text-sm hover:bg-slate-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PayoutHistoryModal;
