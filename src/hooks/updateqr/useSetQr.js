import { useState } from "react";
import BASE_URL from "../../config/api";
import { useAuth } from "../../context/Authcontext";

export const useSetQr = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { accessToken } = useAuth();

  const uploadQr = async (file) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {

      //  FILE SIZE VALIDATION (MAX 1MB)
      if (file.size > 1024 * 1024) {
        throw new Error("File size must be less than 1 MB");
      }

      const formData = new FormData();
      formData.append("qr", file);

      const response = await fetch(`${BASE_URL}/api/admin/session/qr`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { uploadQr, loading, error, success };
};