// src/components/admin/dashboard/PaginationControls.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

function getPaginationNumbers(current, total) {
  const delta = 2;
  const range = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }
  const result = [];
  let last = null;
  range.forEach((i) => {
    if (last && i - last === 2) result.push(last + 1);
    else if (last && i - last !== 1) result.push("...");
    result.push(i);
    last = i;
  });
  return result;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  limit,
  totalPlans,
  setCurrentPage,
  fetchUsers,
}) {
  const pages = getPaginationNumbers(currentPage, totalPages);

  return (
    <div className="px-5 py-4 border-t bg-slate-50">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-600">
          Showing {(currentPage - 1) * limit + 1} to{" "}
          {Math.min(currentPage * limit, totalPlans)} of {totalPlans} submissions
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentPage(currentPage - 1);
              fetchUsers(currentPage - 1, limit);
            }}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          {pages.map((page, idx) =>
            page === "..." ? (
              <span key={idx} className="px-3 py-2 text-slate-500">
                ...
              </span>
            ) : (
              <button
                key={idx}
                onClick={() => {
                  setCurrentPage(page);
                  fetchUsers(page, limit);
                }}
                className={`px-3 py-2 rounded-lg text-sm ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 hover:bg-slate-300"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => {
              setCurrentPage(currentPage + 1);
              fetchUsers(currentPage + 1, limit);
            }}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}