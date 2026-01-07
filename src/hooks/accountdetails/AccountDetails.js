import { useState } from "react";
import BASE_URL from "../../config/api";

export const useAccountDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const saveAccountDetails = async (payload) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`${BASE_URL}/api/admin/bankdetails`, {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save account details");
      }

      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { saveAccountDetails, loading, error, success };
};
