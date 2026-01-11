// hooks/getusersdetails/getUsersDetails.js
import { useCallback, useEffect, useState } from "react";
import BASE_URL from "../../config/api";

export function useUsers(initialPage = 1, initialLimit = 10) {
  const [users, setUsers] = useState([]);
  const [totalPlans, setTotalPlans] = useState(0);
  const [totalAllUsers, setTotalAllUsers] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  const fetchUsers = useCallback(async (page, limitPerPage) => {
    setLoadingUsers(true);
    setErrorUsers(null);

    try {
      const res = await fetch(
        `${BASE_URL}/api/admin/user/allplandetails?page=${page}&limit=${limitPerPage}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 401) {
        setUsers([]);
        setErrorUsers("Unauthorized. Please login again.");
        return;
      }

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const json = await res.json();
      console.log(json);
      

      if (!json?.success) {
        throw new Error(json?.message || "Failed to fetch users");
      }

      const enrichedUsers = Array.isArray(json.data)
        ? json.data.map((item) => ({
          ...item,
          user: {
            _id: item.userId?._id || item.user?._id || null,
            name: item.userId?.name || "N/A",
            email: item.userId?.email || "N/A",
            mobno: item.userId?.mobno || "N/A",
            memId: item.userId?.memId || "N/A",
            totalIncome: item.userId?.totalIncome || 0,
          },
          originalUserId: item.userId,
        }))
        : [];

      setUsers(enrichedUsers);
      setTotalPlans(json.pagination?.totalPlans || 0);
      setTotalAllUsers(json.stats?.totalUsers || 0);
      setPending(json.stats?.pending || 0);
      setApproved(json.stats?.approved || 0);
      setRejected(json.stats?.rejected || 0);
      setTotalPages(json.pagination?.totalPages || 1);
      setLimit(json.pagination?.limit || limitPerPage);
    } catch (err) {
      console.error("Fetch users error:", err);
      setUsers([]);
      setErrorUsers(err.message || "Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, limit);
  }, [currentPage, limit, fetchUsers]);

  return {
    users,
    loadingUsers,
    errorUsers,
    totalPlans,
    totalAllUsers,
    pending,
    approved,
    rejected,
    currentPage,
    totalPages,
    limit,
    setCurrentPage,
    fetchUsers,
  };
}