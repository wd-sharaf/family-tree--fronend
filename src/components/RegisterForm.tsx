import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/client";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerUser({ name, email, password });
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: "80px auto" }}>
      <h2 style={{ textAlign: "center" }}>إنشاء حساب جديد</h2>

      <div style={{ marginBottom: 12 }}>
        <label>الاسم (Name)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>البريد الإلكتروني (Email)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>كلمة المرور (Password)</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
        {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
      </button>

      <p style={{ marginTop: 16, textAlign: "center" }}>
        لديك حساب بالفعل؟{" "}
        <Link to="/login" style={{ color: "#007bff", textDecoration: "underline" }}>
          تسجيل الدخول
        </Link>
      </p>
    </form>
  );
}