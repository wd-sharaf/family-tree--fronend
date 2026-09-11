import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/client";
import AuthLayout from "./AuthLayout";

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
      await registerUser({ full_name: name, email, password });
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="إنشاء حساب جديد">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>الاسم</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
          {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
        </button>

        <p className="helper-link" style={{ marginTop: 20 }}>
          لديك حساب بالفعل؟{" "}
          <Link to="/login">تسجيل الدخول</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
