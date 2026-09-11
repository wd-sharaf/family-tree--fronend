import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

function initials(fullName: string): string {
  const parts = fullName.trim().split(" ");
  return parts[0]?.charAt(0)?.toUpperCase() ?? "?";
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
      .catch(() => setError("تعذّر تحميل شجرة العائلة، أعد تحميل الصفحة"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="empty-state">
        <p>جاري تحميل الشجرة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <p style={{ color: "var(--ember)" }}>{error}</p>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="empty-state">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <path
            d="M36 6v28M36 34 20 50M36 34l16 16M20 50v14M56 50v14M20 50a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm16 0a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm20 0a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM36 14a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
            stroke="var(--brass-dim)"
            strokeWidth="1.5"
          />
        </svg>
        <h2 style={{ fontSize: 18 }}>الأرشيف فارغ حتى الآن</h2>
        <p>لم يُضَف أي فرد إلى الشجرة بعد. ابدأ بإضافة أول شخص لتظهر شجرة العائلة هنا.</p>
        {user?.role === "admin" && (
          <Link to="/person/new" className="btn btn-primary">
            + إضافة أول فرد
          </Link>
        )}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, width: "100%" }}>
      <Tree
        data={treeData}
        orientation="vertical"
        pathFunc="step"
        translate={{ x: window.innerWidth / 2, y: 100 }}
        renderCustomNodeElement={({ nodeDatum }) => (
          <g>
            <circle r={24} fill="var(--ink-raised)" stroke="var(--brass)" strokeWidth={1.5} />
            <text
              textAnchor="middle"
              dy="6"
              style={{ fontFamily: "var(--font-body)", fontSize: 16, fill: "var(--brass)" }}
            >
              {initials(nodeDatum.name)}
            </text>
            <text
              textAnchor="middle"
              y={44}
              style={{ fontFamily: "var(--font-body)", fontSize: 14, fill: "var(--parchment)" }}
            >
              {nodeDatum.name}
            </text>
            {nodeDatum.attributes?.birthYear && (
              <text
                textAnchor="middle"
                y={62}
                style={{ fontFamily: "var(--font-body)", fontSize: 11, fill: "var(--parchment-dim)" }}
              >
                {nodeDatum.attributes.birthYear}
              </text>
            )}
          </g>
        )}
      />
    </div>
  );
}
