import { useEffect, useState } from "react";
import BASE_URL from "../../config/api";

export const useUserPayoutHistory = (userId) => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchPayouts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${BASE_URL}/api/admin/payouthistory/user/${userId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch user payout history");
        }

        const result = await res.json();
        setPayouts(result?.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, [userId]);

  return { payouts, loading, error };
};
