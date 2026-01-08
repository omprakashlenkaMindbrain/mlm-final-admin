import { useEffect, useState } from "react";
import BASE_URL from "../../config/api";

export const useGetKycDetails = (userId, enabled = false) => {
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !userId) return;

    const fetchKyc = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${BASE_URL}/api/admin/getkyc/${userId}`,
          {
            credentials: "include",
          }
        );

        const json = await res.json();

        // 🔥 IMPORTANT FIX HERE
        setKyc(json.data); // ONLY data, not full response
      } catch (err) {
        setError("Failed to load KYC details");
      } finally {
        setLoading(false);
      }
    };

    fetchKyc();
  }, [userId, enabled]);

  return { kyc, loading, error };
};
