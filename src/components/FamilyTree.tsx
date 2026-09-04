import { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import apiClient from "../api/client";
import type { FamilyTreeNode } from "../types";

export default function FamilyTree() {
  const [treeData, setTreeData] = useState<FamilyTreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<FamilyTreeNode>("/tree") // backend يبني الشجرة بـ recursive query
      .then((res) => setTreeData(res.data))
      .catch(() => setError("فشل تحميل شجرة العائلة"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>بيحمل الشجرة...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  if (!treeData) return <p style={{ textAlign: "center" }}>لسه مفيش بيانات، ابدأ بإضافة فرد.</p>;

  return (
    <div style={{ width: "100vw", height: "90vh" }}>
      <Tree
        data={treeData}
        orientation="vertical"
        pathFunc="step"
        translate={{ x: window.innerWidth / 2, y: 100 }}
        renderCustomNodeElement={({ nodeDatum }) => (
          <g>
            <circle r={20} fill="#4f7cff" />
            <text fill="black" x={28} dy=".35em">
              {nodeDatum.name}
            </text>
          </g>
        )}
      />
    </div>
  );
}