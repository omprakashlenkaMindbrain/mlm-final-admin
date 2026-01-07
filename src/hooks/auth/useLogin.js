import { useState } from "react";
import BASE_URL from "../../config/api";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const adminLogin = async (formdata) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // allow httpOnly cookie
        body: JSON.stringify(formdata),
      });
      const data = await res.json();

      if (!res.ok || data?.success !== true) {
        throw new Error(data?.message || "Admin login failed");
      }

      localStorage.setItem(
        "adminLogin",
        JSON.stringify({
          accessToken: data.accessToken,
          user: data.user,
          expiry: Date.now() + 15 * 60 * 1000, // 15 minutes (JWT aligned)
        })
      );

      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    adminLogin,
    loading,
    error,
  };
};
