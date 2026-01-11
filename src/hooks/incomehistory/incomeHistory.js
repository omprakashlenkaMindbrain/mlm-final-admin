// src/hooks/income/useIncomeHistory.js
import { useEffect, useState } from "react";
import BASE_URL from "../../config/api";

export function useIncomeHistory(userId) {
  const [incomeHistory, setIncomeHistory] = useState([]);
  const [loadingIncome, setLoadingIncome] = useState(false);
  const [errorIncome, setErrorIncome] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchIncomeHistory = async () => {
      setLoadingIncome(true);
      setErrorIncome(null);

      try {
        const res = await fetch(
          `${BASE_URL}/api/incomehistory/${userId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const json = await res.json();
        console.log(json);
        

        if (!json?.success) {
          throw new Error(json?.message || "Failed to fetch income history");
        }

        setIncomeHistory(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error("Income history fetch error:", err);
        setIncomeHistory([]);
        setErrorIncome(err.message || "Failed to load income history");
      } finally {
        setLoadingIncome(false);
      }
    };

    fetchIncomeHistory();
  }, [userId]);

  return {
    incomeHistory,
    loadingIncome,
    errorIncome,
  };
}