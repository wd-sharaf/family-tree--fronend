import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Gender, type CreatePersonRequest } from "../types";

export default function PersonFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [form, setForm] = useState<CreatePersonRequest>({
    firstName: "",
    lastName: "",
    gender: Gender.UNKNOWN,
    birthDate: "",
    birthPlace: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    field: keyof CreatePersonRequest,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (id) {
        // تعديل شخص موجود - الباك اند بيتطلب PATCH مش PUT
        await apiClient.patch(`/persons/${id}`, {
          first_name: form.firstName,
          last_name: form.lastName || undefined,
          gender: form.gender,
          birth_date: form.birthDate || undefined,
          birth_place: form.birthPlace || undefined,
          bio: form.bio || undefined,
        });
      } else {
        // إنشاء شخص جديد - محتاج tree_id إجباري (بنستخدم user.id كـ tree_id)
        await apiClient.post("/persons", {
          tree_id: user?.id,
          first_name: form.firstName,
          last_name: form.lastName || undefined,
          gender: form.gender,
          birth_date: form.birthDate || undefined,
          birth_place: form.birthPlace || undefined,
          bio: form.bio || undefined,
        });
      }
      navigate("/");
    } catch {
      setError("حصل خطأ أثناء الحفظ، حاول تاني");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 440,
          border: "1px solid var(--ink-line)",
          borderRadius: 6,
          padding: "36px 32px",
          background: "var(--ink-raised)",
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 28, textAlign: "center" }}>
          {id ? "تعديل فرد" : "إضافة فرد جديد"}
        </h2>

        <div className="field">
          <label>الاسم الأول</label>
          <input
            value={form.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>الاسم الأخير</label>
          <input
            value={form.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>النوع</label>
          <select
            value={form.gender}
            onChange={(e) => handleChange("gender", e.target.value as Gender)}
          >
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
            <option value="other">آخر</option>
            <option value="unknown">غير محدد</option>
          </select>
        </div>

        <div className="field">
          <label>تاريخ الميلاد</label>
          <input
            type="date"
            value={form.birthDate ?? ""}
            onChange={(e) => handleChange("birthDate", e.target.value)}
          />
        </div>

        <div className="field">
          <label>مكان الميلاد</label>
          <input
            value={form.birthPlace ?? ""}
            onChange={(e) => handleChange("birthPlace", e.target.value)}
          />
        </div>

        <div className="field">
          <label>نبذة</label>
          <textarea
            value={form.bio ?? ""}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={4}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-ghost"
            style={{ flex: 1 }}
          >
            إلغاء
          </button>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 2 }}>
            {saving ? "بيحفظ..." : "حفظ"}
          </button>
        </div>
      </form>
    </div>
  );
}
