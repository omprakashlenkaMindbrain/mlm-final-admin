import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { useAdminPayout } from "../../hooks/payout/useAdminPayout";

const PayoutTable = () => {
  const { data, fetchPayoutUsers, loading, error } = useAdminPayout();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPayoutUsers();
  }, [fetchPayoutUsers]);

  /* ---------------- SEARCH ---------------- */
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return data;

    return data.filter(
      (u) =>
        u.memId?.toLowerCase().includes(term) ||
        u.account_holder_name?.toLowerCase().includes(term) ||
        u.account_no?.toString().includes(term)
    );
  }, [data, searchTerm]);

  /* ---------------- SELECT ---------------- */
  const handleRowSelect = (user) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.userId === user.userId);
      return exists
        ? prev.filter((u) => u.userId !== user.userId)
        : [...prev, user];
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers);
    } else {
      setSelectedUsers([]);
    }
  };

  const isAllSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((u) =>
      selectedUsers.some((s) => s.userId === u.userId)
    );

  /* ---------------- EXPORT ---------------- */
  const handleExport = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user");
      return;
    }

    const excelData = selectedUsers.map((u, index) => ({
      "S.No": index + 1,
      "Member ID": u.memId,
      "Account Holder Name": u.account_holder_name,
      "Account Number": u.account_no,
      Status: "Eligible",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payout Users");
    XLSX.writeFile(workbook, "payout_users.xlsx");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-x-auto">
      {/* HEADER */}
      <div className="flex items-center p-4 border-b bg-slate-50">
        <h2 className="font-semibold text-slate-800">Payout Eligible Users</h2>

        <div className="ml-auto flex items-center gap-4">
          <input
            type="text"
            placeholder="Search member / name / account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={!!error}
            className="w-72 px-3 py-2 border rounded text-sm disabled:bg-gray-100"
          />

          <button
            onClick={handleExport}
            disabled={selectedUsers.length === 0 || !!error}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded
                       hover:bg-green-700 disabled:opacity-50"
          >
            Export Selected
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="p-4 text-sm text-slate-500">Loading payout users...</p>
      )}

      {/* ERROR */}
      {error && (
        <p className="p-4 text-sm text-red-600 bg-red-50 border-b">
          Failed to load payout users. Please try again.
        </p>
      )}

      {/* TABLE */}
      <table className="min-w-[1000px] w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
          <tr>
            <th className="px-5 py-3">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                disabled={!!error}
              />
            </th>
            <th className="px-5 py-3 text-left">Member ID</th>
            <th className="px-5 py-3 text-left">Account Holder</th>
            <th className="px-5 py-3 text-left">Account Number</th>
            <th className="px-5 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y bg-white">
          {!loading && !error && filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.some(
                      (u) => u.userId === user.userId
                    )}
                    onChange={() => handleRowSelect(user)}
                  />
                </td>

                <td className="px-5 py-3 font-medium">{user.memId}</td>

                <td className="px-5 py-3">
                  {user.account_holder_name}
                </td>

                <td className="px-5 py-3">
                  {user.account_no}
                </td>

                <td className="px-5 py-3 text-xs text-green-700 font-semibold">
                  Eligible
                </td>
              </tr>
            ))
          ) : (
            !loading &&
            !error && (
              <tr>
                <td
                  colSpan="5"
                  className="px-5 py-6 text-center text-slate-400"
                >
                  No payout eligible users found
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PayoutTable;
