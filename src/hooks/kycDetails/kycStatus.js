import { useState } from "react";
import BASE_URL from "../../config/api";

export const useKycAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updateKycStatus = async ({ userId, status, reason }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/api/admin/kyc/update/${userId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            reason,
          }),
        }
      );

      const json = await res.json();
      console.log(json);

      if (!res.ok || !json.success) {
        throw new Error(json.message || "KYC update failed");
      }

      setData(json.data);
      return json;
    } catch (err) {
      console.error("KYC action error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveKyc = (userId) =>
    updateKycStatus({ userId, status: "approved" });

  const rejectKyc = (userId, reason) =>
    updateKycStatus({ userId, status: "rejected", reason });

  return {
    approveKyc,
    rejectKyc,
    loading,
    error,
    data,
  };
};