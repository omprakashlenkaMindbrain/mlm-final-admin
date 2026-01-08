import { useState } from "react";

import { useGetShowJoinTree } from "../../hooks/alluser-tree/UseGetShowJoinTree";
import { useUsers } from "../../hooks/getusersdetails/getUsersDetails";

import KycReviewModal from "./components/KycReviewModal";
import PaginationControls from "./components/PaginationControls";
import ReferralTreeModal from "./components/ReferralTreeModal";
import ReviewModal from "./components/ReviewModal";
import StatsCards from "./components/StatsCards";
import SubmissionsTable from "./components/SubmissionsTable";

export default function Dashboard() {
  const {
    users,
    loadingUsers,
    errorUsers,
    totalPlans,
    totalAllUsers,
    pending: pendingCount,
    approved: approvedCount,
    rejected: rejectedCount,
    currentPage,
    totalPages,
    limit,
    setCurrentPage,
    fetchUsers,
  } = useUsers(1, 10);

  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedKycUser, setSelectedKycUser] = useState(null);
  const [treeUser, setTreeUser] = useState(null);

  const { getShowJoinTree } = useGetShowJoinTree();

  const statusMap = Object.freeze({
    All: "all",
    Pending: "pending",
    Verified: "approved",
    Rejected: "rejected",
  });

  const filteredUsers = users.filter((u) => {
    const userStatus = u.status || "pending";
    const mappedStatus = statusMap[filter];
    const matchFilter = mappedStatus === "all" || userStatus === mappedStatus;

    const searchLower = searchTerm.toLowerCase();
    const name = u.user?.name?.toLowerCase() ?? "";
    const phone = u.user?.mobno ?? "";
    const memId = u.user?.memId?.toLowerCase() ?? "";

    const matchSearch =
      name.includes(searchLower) ||
      phone.includes(searchTerm) ||
      memId.includes(searchLower);

    return matchFilter && matchSearch;
  });

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const openReferralTree = async (item) => {
    setTreeUser({ item, loading: true, data: null });
    try {
      const response = await getShowJoinTree(item.user.memId);
      setTreeUser({ item, loading: false, data: response?.data });
    } catch (err) {
      setTreeUser({ item, loading: false, data: null });
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6
                 overflow-auto scrollbar-hide"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 text-sm">
          Review and manage plan payment submissions
        </p>
      </div>

      <StatsCards
        totalAllUsers={totalAllUsers}
        totalPlans={totalPlans}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
      />

      <div className="mt-8 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <SubmissionsTable
          loading={loadingUsers}
          error={errorUsers}
          users={filteredUsers}
          totalPlans={totalPlans}
          filter={filter}
          searchTerm={searchTerm}
          limit={limit}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          onLimitChange={(newLimit) => {
            setCurrentPage(1);
            fetchUsers(1, newLimit);
          }}
          onReview={setSelectedUser}
          onKycReview={setSelectedKycUser}
          onTree={openReferralTree}
        />

        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            limit={limit}
            totalPlans={totalPlans}
            setCurrentPage={setCurrentPage}
            fetchUsers={fetchUsers}
          />
        )}
      </div>

      {selectedUser && (
        <ReviewModal
          plan={selectedUser}
          onClose={() => setSelectedUser(null)}
          fetchUsers={fetchUsers}
          currentPage={currentPage}
          limit={limit}
        />
      )}

      {selectedKycUser && (
        <KycReviewModal
          item={selectedKycUser}
          onClose={() => setSelectedKycUser(null)}
        />
      )}

      {treeUser && (
        <ReferralTreeModal
          treeUser={treeUser}
          onClose={() => setTreeUser(null)}
        />
      )}
    </div>
  );
}
