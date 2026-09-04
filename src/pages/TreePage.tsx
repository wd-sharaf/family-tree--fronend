import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FamilyTree from '../components/FamilyTree';

export default function TreePage() {
  const { logout, user } = useAuth();

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 20px",
          borderBottom: "1px solid #eee",
        }}
      >
        <h3>شجرة العائلة</h3>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {user?.role === "admin" && (
            <Link to="/person/new">+ إضافة فرد</Link>
          )}
          <span>{user?.fullName}</span>
          <button onClick={logout}>خروج</button>
        </div>
      </header>
      <FamilyTree />
    </div>
  );
}