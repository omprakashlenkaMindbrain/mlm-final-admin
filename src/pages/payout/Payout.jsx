import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { usePostPayout } from "../../hooks/payout/postPayout";
import { useAdminPayout } from "../../hooks/payout/useAdminPayout";

const PayoutTable = () => {
  const { data = [], fetchPayoutUsers, loading, error } = useAdminPayout();
  const { postPayout, loading: payoutLoading, error: payoutError } = usePostPayout();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    fetchPayoutUsers();
  }, [fetchPayoutUsers]);

  /* ---------------- NORMALIZE API DATA (for display) ---------------- */
  const normalizedUsers = useMemo(() => {
    return data.map((item) => {
      const mainUser = item.users?.find((u) => u._id === item.userId);

      return {
        userId: item.userId,
        memId: mainUser?.memId || "N/A",
        name: mainUser?.name || "N/A",
        account_holder_name: item.account_holder_name,
        account_no: item.account_no,
        totalIncome: mainUser?.totalIncome || 0,
        withdrawn: mainUser?.totalwithdrawincome || 0,
        netincome: mainUser?.netincome || 0,
      };
    });
  }, [data]);

  /* ---------------- SEARCH ---------------- */
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return normalizedUsers;

    return normalizedUsers.filter(
      (u) =>
        u.memId.toLowerCase().includes(term) ||
        u.name.toLowerCase().includes(term) ||
        u.account_holder_name.toLowerCase().includes(term) ||
        u.account_no.toString().includes(term)
    );
  }, [normalizedUsers, searchTerm]);

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

  /* ---------------- EXPORT WITH PAYOUT PROCESSING ---------------- */
  const handleExport = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user");
      return;
    }

    const userIds = selectedUsers.map((u) => u.userId);

    setIsProcessingPayout(true);

    try {
      const response = await postPayout(userIds);
      console.log(response);
      

      // Extract meaningful data from the payout response
      const { payoutUsers = [], autoCollection } = response;

      const excelData = payoutUsers.map((payoutItem, index) => {
        // Find the main user (the one whose userId matches the payout item)
        const mainUser = payoutItem.users.find((u) => u._id === payoutItem.userId);

        if (!mainUser) return null;

        return {
          "S.No": index + 1,
          Name: mainUser.name || "N/A",
          "Member ID": mainUser.memId || "N/A",
          "Total Income": mainUser.totalIncome || 0,
          "TDS (%)": autoCollection?.tds || 0,
          "Admin Charges (%)": autoCollection?.admincharges || 0,
          "Payable Amount": autoCollection?.income || 0, // This seems to be the processed amount
          "Account Holder Name": payoutItem.account_holder_name || "N/A",
          "Account Number": payoutItem.account_no || "N/A",
          "IFSC Code": payoutItem.ifsc_code || "N/A",
          "Branch Name": payoutItem.branch || "N/A",
          "Bank Name": payoutItem.bank || "N/A",
          // Withdrawn: mainUser.totalwithdrawincome || 0,
          // "Net Income (Before Payout)": mainUser.netincome || 0,
          // "Min Amount for Income": autoCollection?.minamountforincome || 0,
          // Status: "Payout Processed",
          "Payout Date": new Date().toLocaleString(),
        };
      }).filter(Boolean); // Remove any null entries

      // Generate and download Excel
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Processed Payout");

      // Customize column widths (optional)
      worksheet["!cols"] = [
        { wch: 6 },   // S.No
        { wch: 15 },  // Member ID
        { wch: 20 },  // Name
        { wch: 25 },  // Account Holder
        { wch: 18 },  // Account Number
        { wch: 15 },  // Total Income
        { wch: 12 },  // Withdrawn
        { wch: 20 },  // Net Income Before
        { wch: 15 },  // Admin Charges
        { wch: 10 },   // TDS
        { wch: 20 },  // Min Amount
        { wch: 18 },  // Final Payable
        { wch: 20 },  // Status
        { wch: 20 },  // Processed At
      ];

      XLSX.writeFile(workbook, `payout_processed_${new Date().toISOString().slice(0, 10)}.xlsx`);

      alert("Payout processed and exported successfully!");

      // Optional: refetch the list to reflect updated netincome etc.
      fetchPayoutUsers();

    } catch (err) {
      console.error("Payout failed:", err);
      alert(payoutError || err.message || "Payout processing failed");
    } finally {
      setIsProcessingPayout(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-x-auto">
      {/* HEADER */}
      <div className="flex items-center p-4 border-b bg-slate-50">
        <h2 className="font-semibold text-slate-800">
          Payout Eligible Users
        </h2>

        <div className="ml-auto flex items-center gap-4">
          <input
            type="text"
            placeholder="Search member / name / account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={!!error || loading}
            className="w-80 px-3 py-2 border rounded text-sm"
          />

          <button
            onClick={handleExport}
            disabled={
              selectedUsers.length === 0 ||
              !!error ||
              loading ||
              isProcessingPayout ||
              payoutLoading
            }
            className="px-6 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessingPayout || payoutLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              "Process & Export Payout"
            )}
          </button>
        </div>
      </div>

      {/* LOADING / ERROR MESSAGES */}
      {loading && (
        <p className="p-4 text-sm text-slate-500">Loading payout users...</p>
      )}

      {error && (
        <p className="p-4 text-sm text-red-600 bg-red-50 border-b">
          Failed to load payout users: {error}
        </p>
      )}

      {payoutError && (
        <p className="p-4 text-sm text-red-600 bg-red-50 border-b">
          Payout error: {payoutError}
        </p>
      )}

      {/* TABLE */}
      <table className="min-w-[1300px] w-full divide-y divide-slate-200 text-sm">
        {/* ... thead remains same ... */}
        <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
          <tr>
            <th className="w-12 px-4 py-3 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="mx-auto"
              />
            </th>
            <th className="px-4 py-3 text-left">S.No</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Member ID</th>
            <th className="px-4 py-3 text-right">Total Income</th>
            <th className="px-4 py-3 text-right">TDS %</th>
            <th className="px-4 py-3 text-right">Admin Charges</th>
            <th className="px-4 py-3 text-right">Payble Amount</th>
            <th className="px-4 py-3 text-left">Account Holder Name</th>
            <th className="px-4 py-3 text-left">Account No</th>
            <th className="px-4 py-3 text-left">IFSC Code</th>
            <th className="px-4 py-3 text-left">Branch Name</th>
            {/* <th className="px-4 py-3 text-right">Withdrawn</th>
            <th className="px-4 py-3 text-center">Status</th> */}
          </tr>
        </thead>

        <tbody className="divide-y bg-white">
          {!loading && !error && filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={user.userId} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    className="mx-auto"
                    checked={selectedUsers.some((u) => u.userId === user.userId)}
                    onChange={() => handleRowSelect(user)}
                  />
                </td>
                <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3 font-semibold">{user.memId}</td>
                <td className="px-4 py-3 text-right">₹{user.netincome}</td>
                <td className="px-4 py-3 text-right">5%</td>
                <td className="px-4 py-3 text-right">₹{user.admincharges}</td>
                <td className="px-4 py-3 text-right">₹{user.payoutAmount}</td>
                <td className="px-4 py-3">{user.account_holder_name}</td>
                <td className="px-4 py-3 font-mono">{user.account_no}</td>
                <td className="px-4 py-3 text-right text-red-600">{user.ifsc_code}</td>
                <td className="px-4 py-3 text-right font-semibold text-green-700">
                  {user.branch}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-700">
                  {user.bank}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-700">
                  {user.Date}
                </td>
              </tr>
            ))
          ) : (
            !loading && !error && (
              <tr>
                <td colSpan="10" className="px-5 py-6 text-center text-slate-400">
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