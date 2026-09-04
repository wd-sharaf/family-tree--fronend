import { useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/client";
import { Gender, type CreatePersonRequest } from "../types";

export default function PersonFormPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // موجود لو Edit، مش موجود لو Add جديد

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
        await apiClient.put(`/persons/${id}`, form);
      } else {
        await apiClient.post("/persons", form);
      }
      navigate("/");
    } catch {
      setError("حصل خطأ أثناء الحفظ، حاول تاني");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>{id ? "تعديل فرد" : "إضافة فرد جديد"}</h2>

      <div style={{ marginBottom: 10 }}>
        <label>الاسم الأول</label>
        <input
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>الاسم الأخير</label>
        <input
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>النوع</label>
        <select
          value={form.gender}
          onChange={(e) => handleChange("gender", e.target.value as Gender)}
          style={{ width: "100%", padding: 8 }}
        >
          <option value="male">ذكر</option>
          <option value="female">أنثى</option>
          <option value="other">آخر</option>
          <option value="unknown">غير محدد</option>
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>تاريخ الميلاد</label>
        <input
          type="date"
          value={form.birthDate ?? ""}
          onChange={(e) => handleChange("birthDate", e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>مكان الميلاد</label>
        <input
          value={form.birthPlace ?? ""}
          onChange={(e) => handleChange("birthPlace", e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>نبذة</label>
        <textarea
          value={form.bio ?? ""}
          onChange={(e) => handleChange("bio", e.target.value)}
          style={{ width: "100%", padding: 8 }}
          rows={4}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={saving} style={{ width: "100%", padding: 10 }}>
        {saving ? "بيحفظ..." : "حفظ"}
      </button>
    </form>
  );
}