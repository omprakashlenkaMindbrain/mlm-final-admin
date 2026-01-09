import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { usePostPayout } from "../../hooks/payout/postPayout";
import { useAdminPayout } from "../../hooks/payout/useAdminPayout";

const TDS_PERCENT = 5;        // 5% TDS
const ADMIN_CHARGE_FLAT = 5; // ₹5 Admin charge

const PayoutTable = () => {
  const { data = [], fetchPayoutUsers, loading, error } = useAdminPayout();
  const { postPayout, loading: payoutLoading, error: payoutError } =
    usePostPayout();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    fetchPayoutUsers();
  }, [fetchPayoutUsers]);

  /* ---------------- NORMALIZE + CALCULATE ---------------- */
  const normalizedUsers = useMemo(() => {
    return data.map((item) => {
      const mainUser = item.users?.find((u) => u._id === item.userId);
      const totalIncome = mainUser?.totalIncome || 0;

      const tdsAmount = (totalIncome * TDS_PERCENT) / 100;
      const adminCharges = ADMIN_CHARGE_FLAT;
      const payoutAmount = totalIncome - tdsAmount - adminCharges;

      return {
        userId: item.userId,
        name: mainUser?.name || "N/A",
        memId: mainUser?.memId || "N/A",
        totalIncome,
        tdsAmount,
        adminCharges,
        payoutAmount,
        account_holder_name: item.account_holder_name,
        account_no: item.account_no,
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
    setSelectedUsers((prev) =>
      prev.some((u) => u.userId === user.userId)
        ? prev.filter((u) => u.userId !== user.userId)
        : [...prev, user]
    );
  };

  const handleSelectAll = (e) => {
    setSelectedUsers(e.target.checked ? filteredUsers : []);
  };

  const isAllSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((u) =>
      selectedUsers.some((s) => s.userId === u.userId)
    );

  /* ---------------- EXPORT ---------------- */
  const handleExport = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user");
      return;
    }

    setIsProcessingPayout(true);

    try {
      const response = await postPayout(
        selectedUsers.map((u) => u.userId)
      );

      const payoutData = response?.responseData || [];

      const excelData = payoutData.map((item, index) => {
        const totalIncome = item.user?.totalIncome || 0;
        const tdsAmount = (totalIncome * TDS_PERCENT) / 100;
        const payoutAmount =
          totalIncome - tdsAmount - ADMIN_CHARGE_FLAT;

        return {
          "S.No": index + 1,
          Name: item.user?.name,
          "Member ID": item.user?.memId,
          "Total Income": totalIncome,
          "TDS (5%)": tdsAmount.toFixed(2),
          "Admin Charges (₹)": ADMIN_CHARGE_FLAT.toFixed(2),
          "Payable Amount": payoutAmount.toFixed(2),
          "Account Holder Name": item.kyc?.acountholdername,
          "Account Number": item.kyc?.acount_no,
          "IFSC Code": item.kyc?.ifsc_code,
          "Branch Name": item.kyc?.brancname,
          "Payout Date": new Date().toLocaleString("en-IN"),
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Processed Payout");

      XLSX.writeFile(
        workbook,
        `payout_processed_${new Date().toISOString().slice(0, 10)}.xlsx`
      );

      alert("Payout processed & exported successfully");
      fetchPayoutUsers();
    } catch (err) {
      console.error(err);
      alert("Payout failed");
    } finally {
      setIsProcessingPayout(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-white rounded-xl shadow border overflow-x-auto">
      {/* HEADER */}
      <div className="flex items-center p-4 border-b bg-slate-50">
        <h2 className="font-semibold">Payout Eligible Users</h2>

        <div className="ml-auto flex gap-4">
          <input
            className="border px-3 py-2 rounded text-sm w-72"
            placeholder="Search member / name / account"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            onClick={handleExport}
            disabled={
              selectedUsers.length === 0 ||
              loading ||
              isProcessingPayout ||
              payoutLoading
            }
            className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50"
          >
            {isProcessingPayout ? "Processing..." : "Process & Export"}
          </button>
        </div>
      </div>

      {/* NOTE */}
      <p className="px-4 py-2 text-xs text-slate-500 bg-slate-50 border-b">
        Note: 5% TDS and ₹5 Admin Charges are deducted from total income to
        calculate payable amount.
      </p>

      {/* TABLE */}
      <table className="min-w-[1200px] w-full text-sm divide-y">
        <thead className="bg-slate-100 text-xs uppercase">
          <tr>
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-4 py-3">S.No</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Member ID</th>
            <th className="px-4 py-3 text-right">Total Income</th>
            <th className="px-4 py-3 text-right">TDS (5%)</th>
            <th className="px-4 py-3 text-right">Admin (₹5)</th>
            <th className="px-4 py-3 text-right">Payable Amount</th>
            <th className="px-4 py-3">Account Holder</th>
            <th className="px-4 py-3">Account No</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u, i) => (
            <tr key={u.userId} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedUsers.some((s) => s.userId === u.userId)}
                  onChange={() => handleRowSelect(u)}
                />
              </td>
              <td className="px-4 py-3">{i + 1}</td>
              <td className="px-4 py-3">{u.name}</td>
              <td className="px-4 py-3 font-semibold">{u.memId}</td>
              <td className="px-4 py-3 text-right">₹{u.totalIncome}</td>
              <td className="px-4 py-3 text-right">₹{u.tdsAmount.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">₹{u.adminCharges}</td>
              <td className="px-4 py-3 text-right font-semibold text-green-700">
                ₹{u.payoutAmount.toFixed(2)}
              </td>
              <td className="px-4 py-3">{u.account_holder_name}</td>
              <td className="px-4 py-3 font-mono">{u.account_no}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayoutTable;
