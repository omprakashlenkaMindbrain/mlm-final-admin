// src/components/admin/dashboard/ReferralTreeModal.jsx
import { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";
import { X, GitBranch } from "lucide-react";

function transformTreeData(apiData) {
  if (!apiData?.user) return { name: "No Data", children: [] };

  const root = apiData.user;
  const children = [];

  if (apiData.leftUser) {
    children.push({
      name: apiData.leftUser.name || "Left User",
      memId: apiData.leftUser.memId,
      email: apiData.leftUser.email,
      mobno: apiData.leftUser.mobno,
      bv: apiData.leftUser.totalleftbv || 0,
      income: apiData.leftUser.totalIncome || 0,
    });
  } else {
    children.push({ name: "Empty Slot" });
  }

  if (apiData.rightUser) {
    children.push({
      name: apiData.rightUser.name || "Right User",
      memId: apiData.rightUser.memId,
      email: apiData.rightUser.email,
      mobno: apiData.rightUser.mobno,
      bv: apiData.rightUser.totalrightbv || 0,
      income: apiData.rightUser.totalIncome || 0,
    });
  } else {
    children.push({ name: "Empty Slot" });
  }

  return {
    name: root.name || "User",
    memId: root.memId,
    email: root.email,
    mobno: root.mobno,
    bv: root.totalleftbv || root.totalrightbv || 0,
    income: root.totalIncome || root.netincome || 0,
    isRoot: true,
    children,
  };
}

function renderCustomNode({ nodeDatum }) {
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
              <div className="text-sm text-gray-600 mt-1">ID: {nodeDatum.memId || "N/A"}</div>
              <div className="text-xs text-gray-600">Email: {nodeDatum.email || "N/A"}</div>
              <div className="text-xs text-gray-600">Mobile: {nodeDatum.mobno || "N/A"}</div>
              <div className="text-xs text-gray-500 mt-2">
                BV: {nodeDatum.bv || 0} | Income: ₹{nodeDatum.income || 0}
              </div>
            </>
          )}
        </div>
      </foreignObject>
    </g>
  );
}

export default function ReferralTreeModal({ treeUser, onClose }) {
  const { item, loading, data } = treeUser || {};
  const treeData = data ? transformTreeData(data) : null;

  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl w-full h-full max-w-7xl max-h-[95vh] shadow-2xl flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-emerald-50">
          <h2 className="text-2xl font-bold text-slate-800">
            Referral Tree – <span className="text-emerald-600">{item?.user?.name}</span> ({item?.user?.memId})
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300">
            <X size={22} className="text-slate-700" />
          </button>
        </div>

        <div ref={containerRef} className="flex-1 bg-gray-50 overflow-hidden">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xl text-slate-600">
              Loading referral tree...
            </div>
          ) : treeData ? (
            <Tree
              data={treeData}
              orientation="vertical"
              translate={{ x: dimensions.width / 2, y: 100 }}
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
  );
}