import { X } from "lucide-react";
import { useState } from "react";
import { useKycAction } from "../../../hooks/kycDetails/kycStatus";
import { useGetKycDetails } from "../../../hooks/kycDetails/updateKyc";

export default function KycReviewModal({ item, onClose }) {
  const { kyc, loading: kycLoading, error } = useGetKycDetails(item.user?._id, true);
  const { approveKyc, rejectKyc, loading } = useKycAction();
  const [reason, setReason] = useState("");

  const status = item.user?.kycStatus || "pending";

  // ✅ Status color map
  const statusColors = {
    pending: "bg-yellow-400 text-black",
    approved: "bg-green-600 text-white",
    rejected: "bg-red-600 text-white",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl w-full max-w-xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between px-5 py-3 border-b">
          <h3 className="font-semibold text-lg">
            KYC Review – {kyc?.userid?.name || "User"}
          </h3>
          <button onClick={onClose} disabled={loading}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 text-sm space-y-4">
          {kycLoading && <p className="text-center text-slate-500">Loading KYC details...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}

          {!kycLoading && !error && kyc && (
            <>
              {/* User Info */}
              <div className="space-y-1">
                <p><strong>Name:</strong> {kyc.userid?.name}</p>
                <p><strong>Mobile:</strong> {kyc.userid?.mobno}</p>
                <p><strong>Member ID:</strong> {kyc.userid?.memId}</p>
                <p><strong>User ID:</strong> {kyc.userid?._id}</p>
              </div>

              {/* Bank Details */}
              <div className="border rounded-lg p-3 bg-slate-50 space-y-1">
                <p><strong>Account Holder:</strong> {kyc.acountholdername}</p>
                <p><strong>Account No:</strong> {kyc.acount_no}</p>
                <p><strong>IFSC:</strong> {kyc.ifsc_code}</p>
                <p><strong>Branch:</strong> {kyc.brancname}</p>
              </div>

              {/* Documents with name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {kyc.adhara_img && (
                  <div className="text-center">
                    <img src={kyc.adhara_img} alt="Aadhaar" className="h-32 rounded border" />
                    <p className="text-xs mt-1">Aadhaar</p>
                  </div>
                )}
                {kyc.pan_img && (
                  <div className="text-center">
                    <img src={kyc.pan_img} alt="PAN" className="h-32 rounded border" />
                    <p className="text-xs mt-1">PAN</p>
                  </div>
                )}
                {kyc.bankpassbook && (
                  <div className="text-center">
                    <img src={kyc.bankpassbook} alt="Bank Passbook" className="h-32 rounded border" />
                    <p className="text-xs mt-1">Bank Passbook</p>
                  </div>
                )}
              </div>

              {/* Status */}
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`capitalize font-semibold px-2 py-1 rounded ${statusColors[kyc.status] || "bg-gray-200 text-black"}`}
                >
                  {kyc.status}
                </span>
              </p>

              {/* Rejection Reason */}
              {status === "pending" && (
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for rejection"
                  className="w-full border rounded p-2"
                />
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          {status === "pending" ? (
            <>
              <button
                onClick={async () => {
                  if (!reason.trim()) return alert("Rejection reason required");
                  await rejectKyc(kyc.userid._id, reason);
                  onClose();
                }}
                disabled={loading}
                className="px-4 py-2 bg-rose-600 text-white rounded"
              >
                Reject
              </button>
              <button
                onClick={async () => {
                  await approveKyc(kyc.userid._id);
                  onClose();
                }}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Approve
              </button>
            </>
          ) : (
            <button onClick={onClose} className="px-4 py-2 bg-slate-300 rounded">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
