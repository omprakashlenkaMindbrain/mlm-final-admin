// src/pages/admin/PayoutHistory.jsx
import { Mail, Phone, IndianRupee } from "lucide-react";
import { useState } from "react";
import { useUsers } from "../../hooks/getusersdetails/getUsersDetails";
import PayoutHistoryModal from "./components/PayoutHistoryModal";

function PayoutHistory() {
  const { users, loadingUsers, errorUsers } = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            User Payout History
          </h2>
          <p className="mt-2 text-lg text-slate-600">
            View individual user payout transactions
          </p>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-xl font-semibold text-slate-800">
              User Directory
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Manage and view all registered platform users
            </p>
          </div>

          {/* TABLE WITH HIDDEN SCROLLBAR */}
          <div className="overflow-x-auto scrollbar-hide">
            {loadingUsers ? (
              <div className="p-12 text-center text-slate-500">
                Loading users...
              </div>
            ) : errorUsers ? (
              <div className="p-12 text-center text-red-600">
                {errorUsers}
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No users found
              </div>
            ) : (
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                    <th className="px-8 py-4 text-left font-medium">Name</th>
                    <th className="px-8 py-4 text-left font-medium">Email</th>
                    <th className="px-8 py-4 text-left font-medium">Phone</th>
                    <th className="px-8 py-4 text-left font-medium">Member ID</th>
                    <th className="px-8 py-4 text-left font-medium">Total Income</th>
                    <th className="px-8 py-4 text-center font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((item) => {
                    const user = item.user || {};
                    const totalIncome = user.totalIncome || 0;

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50 transition-colors duration-200"
                      >
                        {/* NAME */}
                        <td className="px-8 py-5">
                          <div className="font-semibold text-slate-900">
                            {user.name || "N/A"}
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="w-4 h-4 text-slate-500" />
                            <span className="text-sm">
                              {user.email || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* PHONE */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone className="w-4 h-4 text-slate-500" />
                            <span className="text-sm">
                              {user.phone || "9999999999"}
                            </span>
                          </div>
                        </td>

                        {/* MEMBER ID */}
                        <td className="px-8 py-5">
                          <span className="font-mono font-medium text-slate-800">
                            {user.memId || "N/A"}
                          </span>
                        </td>

                        {/* TOTAL INCOME */}
                        <td className="px-8 py-5">
                          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            <IndianRupee className="w-4 h-4" />
                            {totalIncome.toLocaleString()}
                          </div>
                        </td>

                        {/* ACTION */}
                        <td className="px-8 py-5 text-center">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm"
                          >
                            View Payouts
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* MODAL */}
        {selectedUser && (
          <PayoutHistoryModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>

      {/* Hidden Scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default PayoutHistory;