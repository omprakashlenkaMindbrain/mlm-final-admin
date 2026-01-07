import { useState } from "react";
import BASE_URL from "../../config/api";
import { useAuth } from "../../context/Authcontext";

export const useUpdateQr = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { accessToken } = useAuth();

  const updateAdminQr = async (file) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {

      //FILE SIZE VALIDATION (MAX 1 MB)
      if (file.size > 1024 * 1024) {
        throw new Error("File size must be less than 1 MB");
      }

      const formData = new FormData();
      formData.append("qr", file);

      const res = await fetch(`${BASE_URL}/api/admin/session/qr-edit`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update QR");

      setSuccess("QR updated successfully!");
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateAdminQr, loading, error, success };
};