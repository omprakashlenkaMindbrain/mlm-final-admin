import {
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  FileText,
  Filter,
  GitBranch,
  Mail,
  Phone,
  Sparkles,
  Star,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";
import BASE_URL from "../../config/api";
import { useGetShowJoinTree } from "../../hooks/alluser-tree/UseGetShowJoinTree";
import { useUsers } from "../../hooks/getusersdetails/getUsersDetails";

export default function Dashboard() {
  const {
    users,
    loadingUsers,
    errorUsers,
    totalPlans,
    totalAllUsers,
    pending: pendingCount,
    approved: approvedCount,
    rejected: rejectedCount,
    currentPage,
    totalPages,
    limit,
    setCurrentPage,
    fetchUsers,
  } = useUsers(1, 10);

  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [treeUser, setTreeUser] = useState(null);
  const [modalTreeData, setModalTreeData] = useState(null);
  const [treeLoading, setTreeLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const { getShowJoinTree } = useGetShowJoinTree();

  const treeContainerRef = useRef(null);
  const [treeDimensions, setTreeDimensions] = useState({ width: 800, height: 600 });

  const statusMap = Object.freeze({
    All: "all",
    Pending: "pending",
    Verified: "approved",
    Rejected: "rejected",
  });

  const searchLower = searchTerm.toLowerCase();

  const filteredUsers = users.filter((u) => {
    const userStatus = u.status || "pending";
    const mappedStatus = statusMap[filter];
    const matchFilter = mappedStatus === "all" || userStatus === mappedStatus;

    const name = u.user?.name?.toLowerCase() ?? "";
    const phone = u.user?.mobno ?? "";
    const memId = u.user?.memId?.toLowerCase() ?? "";
    const matchSearch =
      name.includes(searchLower) ||
      phone.includes(searchTerm) ||
      memId.includes(searchLower);

    return matchFilter && matchSearch;
  });

  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const formatIST = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const updatePlan = async (planId, status, reason = "") => {
    setLoadingUpdate(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/plan/update/${planId}`, {
        method: "PUT",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status.toLowerCase(), adminComment: reason }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message || "Update failed");

      fetchUsers(currentPage, limit);
      setSelectedUser(null);
    } catch (err) {
      alert("Failed to update plan status: " + err.message);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDownload = (url, label) => {
    if (!url) {
      alert("Document not available");
      return;
    }
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = label;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const openReferralTree = async (item) => {
    setTreeUser(item);
    setTreeLoading(true);
    setModalTreeData(null);

    try {
      const response = await getShowJoinTree(item.user.memId);
      const data = response?.data;

      if (data && data.user) {
        const rootUser = data.user;

        const transformedData = {
          name: rootUser.name || "User",
          memId: rootUser.memId || "N/A",
          email: rootUser.email || "N/A",
          mobno: rootUser.mobno || "N/A",
          bv: rootUser.totalleftbv || rootUser.totalrightbv || 0,
          income: rootUser.totalIncome || rootUser.netincome || 0,
          isRoot: true,
          children: [],
        };

        // Left Leg
        if (data.leftUser) {
          transformedData.children.push({
            name: data.leftUser.name || "Left User",
            memId: data.leftUser.memId || "N/A",
            email: data.leftUser.email || "N/A",
            mobno: data.leftUser.mobno || "N/A",
            bv: data.leftUser.totalleftbv || 0,
            income: data.leftUser.totalIncome || 0,
          });
        } else {
          transformedData.children.push({ name: "Empty Slot" });
        }

        // Right Leg
        if (data.rightUser) {
          transformedData.children.push({
            name: data.rightUser.name || "Right User",
            memId: data.rightUser.memId || "N/A",
            email: data.rightUser.email || "N/A",
            mobno: data.rightUser.mobno || "N/A",
            bv: data.rightUser.totalrightbv || 0,
            income: data.rightUser.totalIncome || 0,
          });
        } else {
          transformedData.children.push({ name: "Empty Slot" });
        }

        setModalTreeData(transformedData);
      } else {
        setModalTreeData({ name: "No Downline Found", children: [] });
      }
    } catch (err) {
      console.error("Error loading tree:", err);
      alert("Failed to load referral tree.");
      setModalTreeData({ name: "Error Loading Tree", children: [] });
    } finally {
      setTreeLoading(false);
    }
  };

  const renderCustomNode = ({ nodeDatum }) => {
    const isEmpty = nodeDatum.name === "Empty Slot";
    const isRoot = nodeDatum.isRoot;

    return (
      <g>
        <circle
          r="16"
          fill={isEmpty ? "#e5e7eb" : isRoot ? "#10b981" : "#6366f1"}
          stroke="#fff"
          strokeWidth="5"
        />
        <foreignObject x="-150" y="-100" width="300" height="200">
          <div
            className={`bg-white rounded-2xl shadow-xl border-4 p-5 text-center ${
              isEmpty
                ? "border-dashed border-gray-400 bg-gray-50"
                : isRoot
                ? "border-green-500"
                : "border-indigo-600"
            }`}
          >
            {isEmpty ? (
              <div className="text-lg font-semibold text-gray-500">Empty Slot</div>
            ) : (
              <>
                <div className="font-bold text-lg text-gray-800">
                  {nodeDatum.name || "Unknown"}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  ID: {nodeDatum.memId || "N/A"}
                </div>
                <div className="text-xs text-gray-600">
                  Email: {nodeDatum.email || "N/A"}
                </div>
                <div className="text-xs text-gray-600">
                  Mobile: {nodeDatum.mobno || "N/A"}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  BV: {nodeDatum.bv || 0} | Income: ₹{nodeDatum.income || 0}
                </div>
              </>
            )}
          </div>
        </foreignObject>
      </g>
    );
  };

  useEffect(() => {
    if (!treeContainerRef.current || !treeUser) return;

    const updateSize = () => {
      setTreeDimensions({
        width: treeContainerRef.current.offsetWidth,
        height: treeContainerRef.current.offsetHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [treeUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 text-sm">Review and manage plan payment submissions</p>
      </div>

      {/* Stats Cards */}
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

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Plan Payment Submissions</h2>
            <p className="text-xs text-slate-500">Users who have submitted payment proof for plan activation</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-white rounded-md px-3 py-1.5 border border-slate-300">
              <Filter size={14} className="text-slate-400" />
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
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
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name, mobile or ID"
              className="border border-slate-300 rounded-md px-3 py-1.5 text-sm outline-none"
            />
            <select
              value={limit}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value, 10);
                setCurrentPage(1);
                fetchUsers(1, newLimit);
              }}
              className="bg-white text-sm border border-slate-300 rounded-md px-3 py-1.5 cursor-pointer"
            >
              {[5, 10, 20, 50].map((val) => (
                <option key={val} value={val}>{val} per page</option>
              ))}
            </select>
          </div>
        </div>

        {loadingUsers ? (
          <div className="p-10 text-center text-slate-500">Loading submissions...</div>
        ) : errorUsers ? (
          <div className="p-10 text-center text-red-600">{errorUsers}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            {totalPlans === 0 ? "No plan submissions yet." : "No submissions match your filters."}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[1200px] w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 text-left">User</th>
                    <th className="px-5 py-3 text-left">Contact</th>
                    <th className="px-5 py-3 text-left">Member ID</th>
                    <th className="px-5 py-3 text-left">Plan</th>
                    <th className="px-5 py-3 text-left">Payment Mode</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Submitted On</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredUsers.map((item) => (
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
                      <td className="px-5 py-3 text-slate-700 font-medium">{item.user?.memId || "N/A"}</td>
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
                            onClick={() => setSelectedUser(item)}
                            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium shadow hover:bg-blue-700"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => openReferralTree(item)}
                            className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium shadow hover:bg-emerald-700 flex items-center gap-1.5"
                          >
                            <GitBranch size={15} />
                            Tree
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t bg-slate-50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-slate-600">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, totalPlans)} of {totalPlans} submissions
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => currentPage > 1 && (setCurrentPage(currentPage - 1), fetchUsers(currentPage - 1, limit))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {getPaginationNumbers().map((page, idx) => (
                      <button
                        key={idx}
                        onClick={() => typeof page === "number" && page !== currentPage && (setCurrentPage(page), fetchUsers(page, limit))}
                        disabled={page === "..."}
                        className={`px-3 py-2 rounded-lg text-sm ${page === currentPage ? "bg-blue-600 text-white" : page === "..." ? "text-slate-500" : "bg-slate-200 hover:bg-slate-300"}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => currentPage < totalPages && (setCurrentPage(currentPage + 1), fetchUsers(currentPage + 1, limit))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border disabled:opacity-40"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Modal */}
      {selectedUser && (
        <ReviewModal
          plan={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={updatePlan}
          onDownload={handleDownload}
          loading={loadingUpdate}
        />
      )}

      {/* Referral Tree Modal */}
      {treeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-2xl w-full h-full max-w-7xl max-h-[95vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-emerald-50">
              <h2 className="text-2xl font-bold text-slate-800">
                Referral Tree – <span className="text-emerald-600">{treeUser.user?.name}</span> ({treeUser.user?.memId})
              </h2>
              <button
                onClick={() => {
                  setTreeUser(null);
                  setModalTreeData(null);
                }}
                className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300"
              >
                <X size={22} className="text-slate-700" />
              </button>
            </div>

            <div ref={treeContainerRef} className="flex-1 bg-gray-50 overflow-hidden">
              {treeLoading ? (
                <div className="h-full flex items-center justify-center text-xl text-slate-600">
                  Loading referral tree...
                </div>
              ) : modalTreeData ? (
                <Tree
                  data={modalTreeData}
                  orientation="vertical"
                  translate={{ x: treeDimensions.width / 2, y: 100 }}
                  nodeSize={{ x: 340, y: 260 }}
                  separation={{ siblings: 1.8, nonSiblings: 2.2 }}
                  renderCustomNodeElement={renderCustomNode}
                  pathFunc="step"
                  zoomable
                  draggable
                  styles={{ links: { stroke: "#94a3b8", strokeWidth: 4 } }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-lg">
                  No downline available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Helper Components */

function PaymentModeBadge({ mode }) {
  const isUPI = mode?.toLowerCase() === "upi";
  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${isUPI ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
      <CreditCard size={13} />
      {isUPI ? "UPI" : mode?.toUpperCase() || "N/A"}
    </div>
  );
}

function StatusBadge({ status = "pending", reason }) {
  const config = {
    approved: { icon: <CheckCircle size={14} />, bg: "#10b981", label: "Approved" },
    pending: { icon: <Clock size={14} />, bg: "#f59e0b", label: "Pending" },
    rejected: { icon: <XCircle size={14} />, bg: "#dc2626", label: "Rejected" },
  }[status?.toLowerCase()] || { icon: <Clock size={14} />, bg: "#f59e0b", label: "Pending" };

  return (
    <div>
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-white" style={{ backgroundColor: config.bg }}>
        {config.icon}
        {config.label}
      </div>
      {reason && <p className="text-[11px] text-red-600 italic mt-1">{reason}</p>}
    </div>
  );
}

function SubscriptionBadge({ plan }) {
  const configMap = {
    "ibo": { icon: <Award size={16} />, bg: "#64748b" },
    "silver ibo": { icon: <Sparkles size={16} />, bg: "#e5e7eb", color: "#374151" },
    "gold ibo": { icon: <Star size={16} />, bg: "#f59e0b" },
    "star ibo": { icon: <Star size={16} />, bg: "#2563eb" },
  };

  const normalized = plan?.toLowerCase();
  const config = configMap[normalized] || { icon: null, bg: "#f3f4f6", color: "#6b7280" };

  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium text-white" style={{ backgroundColor: config.bg, color: config.color || "white" }}>
      {config.icon}
      {plan ? plan.toUpperCase() : "Unknown Plan"}
    </div>
  );
}

function ReviewModal({ plan, onClose, onUpdate, onDownload, loading }) {
  const [reason, setReason] = useState("");
  const status = plan.status?.toLowerCase();

  const formatIST = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 border-b bg-slate-50">
          <h3 className="font-semibold text-lg">Review Submission – {plan.user?.name}</h3>
          <button onClick={onClose} disabled={loading}>
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 text-sm space-y-3">
          <p><span className="text-slate-500">Member ID:</span> <strong>{plan.user?.memId}</strong></p>
          <p><span className="text-slate-500">Email:</span> {plan.user?.email}</p>
          <p><span className="text-slate-500">Phone:</span> {plan.user?.mobno}</p>
          <p><span className="text-slate-500">Plan:</span> {plan.plan_name?.toUpperCase()}</p>
          <p><span className="text-slate-500">Payment Mode:</span> <PaymentModeBadge mode={plan.payment_mode} /></p>
          <p><span className="text-slate-500">Submitted:</span> {formatIST(plan.createdAt)}</p>

          <div className="mt-4">
            <p className="font-medium mb-2">Payment Screenshot:</p>
            {plan.payment_ss ? (
              <div className="flex justify-between items-center bg-slate-50 border rounded-md px-3 py-2">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-blue-600" />
                  Payment Proof ({plan.payment_mode?.toUpperCase()})
                </div>
                <button
                  onClick={() => onDownload(plan.payment_ss, `${plan.user?.memId}-payment-proof`)}
                  className="text-blue-600 text-xs flex items-center gap-1"
                >
                  <Download size={12} /> Download
                </button>
              </div>
            ) : (
              <p className="text-rose-600 italic text-xs">No screenshot uploaded</p>
            )}
          </div>

          {status === "pending" && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Reason for rejection (optional)"
              className="w-full mt-4 border rounded-md p-3 text-sm resize-none"
              disabled={loading}
            />
          )}
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t bg-slate-50">
          {status === "pending" ? (
            <>
              <button
                onClick={() => onUpdate(plan.user._id, "rejected", reason)}
                className="px-5 py-2 bg-rose-600 text-white rounded-md text-sm hover:bg-rose-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Rejecting..." : "Reject"}
              </button>
              <button
                onClick={() => onUpdate(plan.user._id, "approved")}
                className="px-5 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Approving..." : "Approve"}
              </button>
            </>
          ) : (
            <button onClick={onClose} className="px-5 py-2 bg-slate-300 rounded-md text-sm" disabled={loading}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}