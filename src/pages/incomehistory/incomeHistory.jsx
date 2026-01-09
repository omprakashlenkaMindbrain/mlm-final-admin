// src/pages/admin/AllUsers.jsx
import { useUsers } from "../../hooks/getusersdetails/getUsersDetails";
import UsersTable from "./components/UserTable";

export default function AllUsers() {
  const {
    users,
    loadingUsers,
    errorUsers,
    totalAllUsers,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useUsers(1, 10);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            All Users
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Total registered users:{" "}
            <span className="font-semibold text-slate-900">
              {totalAllUsers?.toLocaleString() || 0}
            </span>
          </p>
        </div>

        {/* Users Table Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-slate-800">
              User Directory
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Manage and view all registered platform users
            </p>
          </div>

          {/* Scrollable container with hidden scrollbar */}
          <div className="overflow-x-auto scrollbar-hide">
            <UsersTable
              users={users}
              loading={loadingUsers}
              error={errorUsers}
            />
          </div>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing page{" "}
              <span className="font-medium text-slate-900">{currentPage}</span>{" "}
              of{" "}
              <span className="font-medium text-slate-900">{totalPages}</span>
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium
                           hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all
                        ${currentPage === pageNum
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <span className="px-3 text-slate-500">...</span>
                )}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium
                           hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 flex items-center gap-2"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}