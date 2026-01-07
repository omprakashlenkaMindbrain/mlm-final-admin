import { useEffect, useState } from "react";
import { useGetShowJoinTree } from "../../hooks/alluser-tree/UseGetShowJoinTree";

const UserTree = () => {
  const { getShowJoinTree, loading, error } = useGetShowJoinTree();
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    loadTree(); // load ROOT user
  }, []);

  const loadTree = async (memId) => {
    try {
      const res = await getShowJoinTree(memId);

      // API RESPONSE SHAPE:
      // { success, message, data: { user, leftUser, rightUser } }
      if (res?.data) {
        setTreeData(res.data);
      }
    } catch (err) {
      console.error("Failed to load tree", err);
    }
  };

  const handleNodeClick = (memId) => {
    if (memId) loadTree(memId);
  };

  if (loading) {
    return <div className="py-10 text-center">Loading tree…</div>;
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!treeData) {
    return <div className="py-10 text-center">No data</div>;
  }

  const { user, leftUser, rightUser } = treeData;

  return (
    <div className="w-full overflow-x-auto py-10">
      <h2 className="text-xl font-semibold text-center mb-10">
        Binary Referral Tree
      </h2>

      <div className="tree-wrapper">
        {/* ROOT */}
        {user && (
          <div className="tree-node root">
            <Node
              member={user}
              onClick={() => handleNodeClick(user.memId)}
            />
          </div>
        )}

        {/* VERTICAL LINE */}
        {(leftUser || rightUser) && <div className="vertical-line" />}

        {/* CHILDREN */}
        <div className="children">
          {/* LEFT */}
          <div className="child">
            {leftUser ? (
              <>
                <div className="connector left" />
                <Node
                  member={leftUser}
                  onClick={() => handleNodeClick(leftUser.memId)}
                />
              </>
            ) : (
              <EmptyNode />
            )}
          </div>

          {/* RIGHT */}
          <div className="child">
            {rightUser ? (
              <>
                <div className="connector right" />
                <Node
                  member={rightUser}
                  onClick={() => handleNodeClick(rightUser.memId)}
                />
              </>
            ) : (
              <EmptyNode />
            )}
          </div>
        </div>
      </div>

      {/* TREE STYLES */}
      <style jsx>{`
        .tree-wrapper {
          min-width: 700px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tree-node {
          position: relative;
          z-index: 2;
        }

        .vertical-line {
          width: 2px;
          height: 40px;
          background: #6b7280;
        }

        .children {
          display: flex;
          gap: 140px;
          position: relative;
          padding-top: 30px;
        }

        .child {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .connector {
          position: absolute;
          top: -30px;
          width: 70px;
          height: 30px;
          border-top: 2px solid #6b7280;
        }

        .connector.left {
          right: 50%;
          border-left: 2px solid #6b7280;
          border-top-left-radius: 12px;
        }

        .connector.right {
          left: 50%;
          border-right: 2px solid #6b7280;
          border-top-right-radius: 12px;
        }
      `}</style>
    </div>
  );
};

/* =========================
   NODE COMPONENT
========================= */

const Node = ({ member, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer transition hover:scale-105"
    >
      <div
        className={`w-44 rounded-lg border shadow-sm px-3 py-2 text-center text-sm
          ${
            member?.isActive
              ? "bg-emerald-600 text-white border-emerald-800"
              : "bg-slate-700 text-white border-slate-900"
          }
        `}
      >
        <p className="font-semibold truncate">
          {member?.name || "Unknown"}
        </p>
        <p className="text-xs opacity-90">
          ID: {member?.memId}
        </p>
      </div>
    </div>
  );
};

/* =========================
   EMPTY NODE
========================= */

const EmptyNode = () => {
  return (
    <div className="w-44 rounded-lg border border-dashed text-center py-6 text-xs text-slate-400">
      Empty Slot
    </div>
  );
};

export default UserTree;
