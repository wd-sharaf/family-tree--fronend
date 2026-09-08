import { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

// شكل الرد الفعلي من الباك اند (PersonRead + TreeNode)
interface BackendPersonRead {
  id: string;
  first_name: string;
  last_name: string | null;
  gender: string | null;
  birth_date: string | null;
}

interface BackendTreeNode {
  person: BackendPersonRead;
  children: BackendTreeNode[];
  spouses: BackendPersonRead[];
}

// شكل react-d3-tree المطلوب
interface D3TreeNode {
  name: string;
  attributes?: Record<string, string>;
  children?: D3TreeNode[];
}

function transformNode(node: BackendTreeNode): D3TreeNode {
  return {
    name: `${node.person.first_name} ${node.person.last_name ?? ""}`.trim(),
    attributes: {
      birthYear: node.person.birth_date?.slice(0, 4) ?? "",
      gender: node.person.gender ?? "unknown",
    },
    children: node.children.map(transformNode),
  };
}

export default function FamilyTree() {
  const { user } = useAuth();
  const [treeData, setTreeData] = useState<D3TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const treeId = user.id; // كل مستخدم شجرته الخاصة (tree_id = user.id)

    apiClient
      .get<BackendPersonRead[]>("/persons", { params: { tree_id: treeId } })
      .then((personsRes) => {
        const persons = personsRes.data;
        if (persons.length === 0) {
          setTreeData(null);
          return null;
        }
        const rootId = persons[0].id; // أول شخص متسجل كـ جذر مؤقتًا
        return apiClient
          .get<BackendTreeNode>(`/tree/${rootId}/nested`, { params: { tree_id: treeId } })
          .then((res) => setTreeData(transformNode(res.data)));
      })
      .catch(() => setError("فشل تحميل شجرة العائلة"))
      .finally(() => setLoading(false));
  }, [user?.id]);

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