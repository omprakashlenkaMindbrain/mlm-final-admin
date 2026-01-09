import { useState } from "react";
import BASE_URL from "../../config/api";

export const usePostPayout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const postPayout = async (userIds) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BASE_URL}/api/admin/payout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payout failed");
      }

      return data; // ✅ RETURN RESPONSE
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postPayout, loading, error };
};
