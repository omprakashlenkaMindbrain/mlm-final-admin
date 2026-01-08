// src/components/admin/dashboard/SubmissionsTable.jsx
import { Filter, GitBranch, Mail, Phone } from "lucide-react";
import PaymentModeBadge from "./badges/PaymentModeBadge";
import StatusBadge from "./badges/StatusBadge";
import SubscriptionBadge from "./badges/SubscriptionBadge";

const formatIST = (date) =>
    date
        ? new Date(date).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "N/A";

export default function SubmissionsTable({
    loading,
    error,
    users,
    totalPlans,
    filter,
    searchTerm,
    limit,
    onFilterChange,
    onSearchChange,
    onLimitChange,
    onReview,
    onKycReview,
    onTree,
}) {
    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-5 py-4 border-b border-slate-200 bg-slate-50">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Plan Payment Submissions
                    </h2>
                    <p className="text-xs text-slate-500">
                        Users who have submitted payment proof for plan activation
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 bg-white rounded-md px-3 py-1.5 border border-slate-300">
                        <Filter size={14} className="text-slate-400" />
                        <select
                            value={filter}
                            onChange={(e) => onFilterChange(e.target.value)}
                            className="bg-transparent text-sm outline-none cursor-pointer"
                        >
                            <option>All</option>
                            <option>Pending</option>
                            <option>Verified</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by name, mobile or ID"
                        className="border border-slate-300 rounded-md px-3 py-1.5 text-sm outline-none"
                    />
                    <select
                        value={limit}
                        onChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
                        className="bg-white text-sm border border-slate-300 rounded-md px-3 py-1.5 cursor-pointer"
                    >
                        {[5, 10, 20, 50].map((val) => (
                            <option key={val} value={val}>
                                {val} per page
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="p-10 text-center text-slate-500">Loading submissions...</div>
            ) : error ? (
                <div className="p-10 text-center text-red-600">{error}</div>
            ) : users.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                    {totalPlans === 0 ? "No plan submissions yet." : "No submissions match your filters."}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-[1200px] w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
                            <tr>
                                <th className="px-5 py-3 text-left">User</th>
                                <th className="px-5 py-3 text-left">Contact</th>
                                <th className="px-5 py-3 text-left">Member ID</th>
                                <th className="px-5 py-3 text-left">Plan</th>
                                <th className="px-5 py-3 text-left">Payment Mode</th>
                                <th className="px-5 py-3 text-left">Plan Status</th>
                                <th className="px-5 py-3 text-left">Submitted On</th>
                                <th className="px-5 py-3 text-center">Actions</th>
                                <th className="px-5 py-3 text-left">Kyc Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {users.map((item) => (
                                <tr key={item._id} className="hover:bg-slate-50">
                                    <td className="px-5 py-3 font-medium text-slate-900">
                                        {item.user?.name || "N/A"}
                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                            <Mail size={12} /> {item.user?.email || "N/A"}
                                        </p>
                                    </td>
                                    <td className="px-5 py-3 text-slate-700 flex items-center gap-1">
                                        <Phone size={13} /> {item.user?.mobno || "N/A"}
                                    </td>
                                    <td className="px-5 py-3 text-slate-700 font-medium">
                                        {item.user?.memId || "N/A"}
                                    </td>
                                    <td className="px-5 py-3">
                                        <SubscriptionBadge plan={item.plan_name} />
                                    </td>
                                    <td className="px-5 py-3">
                                        <PaymentModeBadge mode={item.payment_mode} />
                                    </td>
                                    <td className="px-5 py-3">
                                        <StatusBadge status={item.status} reason={item.adminComment} />
                                    </td>
                                    <td className="px-5 py-3 text-slate-500 text-xs">
                                        {formatIST(item.createdAt)}
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => onReview(item)}
                                                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium shadow hover:bg-blue-700"
                                            >
                                                Review
                                            </button>
                                            <button
                                                onClick={() => onTree(item)}
                                                className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium shadow hover:bg-emerald-700 flex items-center gap-1.5"
                                            >
                                                <GitBranch size={15} />
                                                Tree
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <button
                                            onClick={() => onKycReview(item)}
                                            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium shadow hover:bg-blue-700"
                                        >
                                            Kyc Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}