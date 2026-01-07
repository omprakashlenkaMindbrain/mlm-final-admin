import { useState } from "react";
import BASE_URL from "../../config/api";

export const useGenerateIncome = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const generateIncome = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/genincome`, {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      console.log(json);
      

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to generate income");
      }

      setData(json.data);
      return json;
    } catch (err) {
      console.error("Income generation error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateIncome, loading, error, data };
};
