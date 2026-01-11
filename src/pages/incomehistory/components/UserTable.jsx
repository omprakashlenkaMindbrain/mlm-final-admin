// src/components/admin/UsersTable.jsx
import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useIncomeHistory } from "../../../hooks/incomehistory/incomeHistory";

export default function UsersTable({ users, loading, error }) {
  const [selectedUser, setSelectedUser] = useState(null);

  if (loading) {
    return <div className="p-16 text-center text-slate-500">Loading users...</div>;
  }

  if (error) {
    return <div className="p-16 text-center text-red-600">{error}</div>;
  }

  if (!users.length) {
    return <div className="p-16 text-center text-slate-500">No users found.</div>;
  }

  return (
    <>
      {/* MAIN TABLE WITH ACTION COLUMN */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[1100px] text-sm">
          {/* HEADER */}
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-200">
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                NAME
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                EMAIL
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                PHONE
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                MEMBER ID
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                TOTAL INCOME
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                ACTION
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="bg-white divide-y divide-slate-100">
            {users.map((item) => {
              const user = item.user || {};
              const totalIncome = user.totalIncome || 0;

              return (
                <tr
                  key={item._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {/* NAME */}
                  <td className="px-6 py-5">
                    <div className="font-medium text-slate-900">
                      {user.name || "N/A"}
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">
                        {user.email || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* PHONE */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">
                        {user.mobno || user.phone || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* MEMBER ID */}
                  <td className="px-6 py-5">
                    <div className="font-medium text-slate-700">
                      {user.memId || "N/A"}
                    </div>
                  </td>

                  {/* TOTAL INCOME */}
                  <td className="px-6 py-5 text-right">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-200">
                      <span>₹</span>
                      {totalIncome.toLocaleString()}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                  </td>

                  {/* ACTION COLUMN - BUTTON */}
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => setSelectedUser(item)}
                      className="px-5 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg 
                                 hover:bg-indigo-700 transition shadow-sm"
                    >
                      View History
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* INCOME HISTORY MODAL */}
      {selectedUser && (
        <IncomeHistoryModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}

/* ================= INCOME HISTORY MODAL (Unchanged - Clean & Modern) ================= */
function IncomeHistoryModal({ user, onClose }) {
  const userId = user.user?._id;
  
  const { incomeHistory, loadingIncome, errorIncome } = useIncomeHistory(userId);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            Income History — {user.user?.name || "User"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-slate-50 rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-slate-600 font-medium">Email:</span>
              <span className="ml-2 text-slate-900">{user.user?.email || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-600 font-medium">Phone:</span>
              <span className="ml-2 text-slate-900">{user.user?.mobno || user.user?.phone || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-600 font-medium">Member ID:</span>
              <span className="ml-2 text-slate-900 font-medium">{user.user?.memId || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-600 font-medium">Total Income:</span>
              <span className="ml-3 text-emerald-700 font-bold text-lg">
                ₹{(user.user?.totalIncome || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {loadingIncome && (
            <div className="text-center py-12 text-slate-500">Loading income history...</div>
          )}

          {errorIncome && (
            <div className="text-center py-12 text-red-600">{errorIncome}</div>
          )}

          {!loadingIncome && !errorIncome && incomeHistory.length === 0 && (
            <div className="text-center py-12 text-slate-500">No income history found</div>
          )}

          {!loadingIncome && !errorIncome && incomeHistory.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">Date</th>
                    <th className="px-6 py-4 text-left font-medium">Amount</th>
                    <th className="px-6 py-4 text-left font-medium">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {incomeHistory.map((entry) => (
                    <tr key={entry._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 font-semibold text-emerald-700">
                        ₹{entry.income.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {entry.remark || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}