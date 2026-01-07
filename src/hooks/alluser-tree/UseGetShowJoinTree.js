// src/hooks/alluser-tree/useGetShowJoinTree.js
import { useState } from "react";
import BASE_URL from "../../config/api";

export const useGetShowJoinTree = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getShowJoinTree = async (memId) => {
    setLoading(true);
    setError(null);

    try {
      const url = memId
        ? `${BASE_URL}/api/admin/showjoin?memId=${encodeURIComponent(memId)}`
        : `${BASE_URL}/api/admin/showjoin`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to fetch downline");
      }
      return result;
    } catch (err) {
      console.error("Error fetching downline:", err);
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getShowJoinTree,
    loading,
    error,
  };
};