import { useState } from "react";
import BASE_URL from "../../config/api";

export const useBankDetailsEdit = () => {

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const editBankDetails = async (id, payload) => {
    if (!id) {
      setError("Bank record ID is missing");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await fetch(`${BASE_URL}/api/admin/bankdetails/${id}`, {
        method: "PUT",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.msg || "Failed to update bank details");
      }

      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Edit bank details error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    editBankDetails,
    loading,
    success,
    error,
  };
};