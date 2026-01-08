// src/components/admin/dashboard/StatsCards.jsx
import { Users, FileText, Clock, CheckCircle, XCircle } from "lucide-react";

export default function StatsCards({
  totalAllUsers,
  totalPlans,
  pendingCount,
  approvedCount,
  rejectedCount,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
      <div className="p-6 rounded-2xl shadow-md bg-sky-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Total Registered Users</p>
            <p className="text-3xl font-bold mt-1">{totalAllUsers}</p>
          </div>
          <Users size={32} className="text-white/80" />
        </div>
      </div>

      <div className="p-6 rounded-2xl shadow-md bg-orange-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Total Submissions</p>
            <p className="text-3xl font-bold mt-1">{totalPlans}</p>
          </div>
          <FileText size={32} className="text-white/80" />
        </div>
      </div>

      <div className="p-6 rounded-2xl shadow-md bg-amber-400 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Pending Review</p>
            <p className="text-3xl font-bold mt-1">{pendingCount}</p>
          </div>
          <Clock size={32} className="text-white/80" />
        </div>
      </div>

      <div className="p-6 rounded-2xl shadow-md bg-emerald-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Approved</p>
            <p className="text-3xl font-bold mt-1">{approvedCount}</p>
          </div>
          <CheckCircle size={32} className="text-white/80" />
        </div>
      </div>

      <div className="p-6 rounded-2xl shadow-md bg-rose-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Rejected</p>
            <p className="text-3xl font-bold mt-1">{rejectedCount}</p>
          </div>
          <XCircle size={32} className="text-white/80" />
        </div>
      </div>
    </div>
  );
}