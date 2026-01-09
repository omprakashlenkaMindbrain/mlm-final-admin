import { useCallback, useState } from "react";
import BASE_URL from "../../config/api";

export const useAdminPayout = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayoutUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/payout`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch payout users");
      }

      const json = await res.json();

      console.log(json);
      

      setData(Array.isArray(json.user) ? json.user : []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchPayoutUsers,
  };
};
