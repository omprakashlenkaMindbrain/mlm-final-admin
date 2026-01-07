import { useState } from "react";
import BASE_URL from "../../config/api";

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const adminSignup = async (formdata) => {  // no destructuring
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${BASE_URL}/api/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Signup failed");
      }

      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { adminSignup, loading, error, success };
};
