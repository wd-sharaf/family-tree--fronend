import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FamilyTree from "../components/FamilyTree";

export default function TreePage() {
  const { logout, user } = useAuth();

  return (
    <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 32px",
          borderBottom: "1px solid var(--ink-line)",
        }}
      >
        <h1 style={{ fontSize: "26px", color: "var(--brass)" }}>شجرة العائلة</h1>

        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          {user?.role === "admin" && (
            <Link to="/person/new" className="btn btn-ghost" style={{ fontSize: 14, padding: "8px 16px" }}>
              + إضافة فرد
            </Link>
          )}
          <span style={{ color: "var(--parchment-dim)", fontSize: 14 }}>{user?.fullName}</span>
          <button onClick={logout} className="btn btn-ghost" style={{ fontSize: 14, padding: "8px 16px" }}>
            خروج
          </button>
        </div>
      </header>

      <FamilyTree />
    </div>
  );
}
