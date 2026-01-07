import React, { useEffect, useState } from "react";
import { useGenerateIncome } from "../../hooks/incomeGenerate/incomeGenerate";
import * as XLSX from "xlsx";

const PayoutTable = () => {
  const { data, generateIncome, loading, error } = useGenerateIncome();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    generateIncome();
  }, []);

  // Safe fallback
  const results = Array.isArray(data?.results) ? data.results : [];

  const formatJoiningTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Search filter
  const filteredResults = results.filter((user) => {
    if (!user) return false;
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return (
      user.name?.toLowerCase().includes(term) ||
      user.mob?.toString().includes(term)
    );
  });

  // Row checkbox toggle
  const handleRowSelect = (user) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.mob === user.mob);
      if (exists) {
        return prev.filter((u) => u.mob !== user.mob);
      }
      return [...prev, user];
    });
  };

  // Header checkbox toggle
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredResults);
    } else {
      setSelectedUsers([]);
    }
  };

  // Check if all selected (search-aware)
  const isAllSelected =
    filteredResults.length > 0 &&
    filteredResults.every((user) =>
      selectedUsers.some((u) => u.mob === user.mob)
    );

  // Export to Excel
  const handleExport = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user");
      return;
    }

    try {
      const excelData = selectedUsers.map((user) => ({
        Name: user.name,
        Mobile: user.mob,
        "Joined At": formatJoiningTime(user.date),
        "Matched BV": user.matchedBV,
        Income: user.income,
        "Total Income": user.totalIncome,
        "Carry Left": user.carryForward?.left ?? 0,
        "Carry Right": user.carryForward?.right ?? 0,
        Status: user.message,
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Payout Users");

      XLSX.writeFile(workbook, "payout_users.xlsx");
    } catch (err) {
      alert("Failed to export file. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-x-auto">
      {/* Header */}
     <div className="flex items-center p-4 border-b bg-slate-50">
  {/* Left */}
  <h2 className="font-semibold text-slate-800">Payout List</h2>

  {/* Right */}
  <div className="ml-auto flex items-center gap-4">
    <input
      type="text"
      placeholder="Search by name or mobile..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      disabled={!!error}
      className="w-64 px-3 py-2 border rounded text-sm disabled:bg-gray-100"
    />

    <button
      onClick={handleExport}
      disabled={selectedUsers.length === 0 || !!error}
      className="px-4 py-2 bg-green-600 text-white text-sm rounded
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:bg-green-700"
    >
      Export Selected
    </button>
  </div>
</div>


      {/* Loading */}
      {loading && (
        <p className="p-4 text-sm text-slate-500">Loading data...</p>
      )}

      {/*  Error Message */}
      {error && (
        <p className="p-4 text-sm text-red-600 bg-red-50 border-b">
           Failed to load payout data. Please refresh or try again later.
        </p>
      )}
      <table className="min-w-[1200px] w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
          <tr>
            <th className="px-5 py-3 text-left">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                disabled={!!error}
              />
            </th>
            <th className="px-5 py-3 text-left">Name</th>
            <th className="px-5 py-3 text-left">Mobile</th>
            <th className="px-5 py-3 text-left">Joined At</th>
            <th className="px-5 py-3 text-right">Matched BV</th>
            <th className="px-5 py-3 text-right">Income</th>
            <th className="px-5 py-3 text-right">Total Income</th>
            <th className="px-5 py-3 text-right">Carry Left</th>
            <th className="px-5 py-3 text-right">Carry Right</th>
            <th className="px-5 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y bg-white">
          {!loading && !error && filteredResults.length > 0 ? (
            filteredResults.map((user, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.some(
                      (u) => u.mob === user.mob
                    )}
                    onChange={() => handleRowSelect(user)}
                  />
                </td>
                <td className="px-5 py-3 font-medium">{user.name}</td>
                <td className="px-5 py-3">{user.mob}</td>
                <td className="px-5 py-3 text-xs">
                  {formatJoiningTime(user.date)}
                </td>
                <td className="px-5 py-3 text-right">{user.matchedBV}</td>
                <td className="px-5 py-3 text-right text-green-600 font-semibold">
                  ₹{user.income}
                </td>
                <td className="px-5 py-3 text-right">
                  ₹{user.totalIncome}
                </td>
                <td className="px-5 py-3 text-right">
                  {user.carryForward?.left ?? 0}
                </td>
                <td className="px-5 py-3 text-right">
                  {user.carryForward?.right ?? 0}
                </td>
                <td className="px-5 py-3 text-xs">{user.message}</td>
              </tr>
            ))
          ) : (
            !loading &&
            !error && (
              <tr>
                <td colSpan="10" className="px-5 py-6 text-center text-slate-400">
                  No data found
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
