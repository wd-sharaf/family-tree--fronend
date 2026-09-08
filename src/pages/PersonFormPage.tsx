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

  const handleChange = (field: keyof CreatePersonRequest, value: string) => {
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
        // إنشاء شخص جديد - محتاج tree_id إجباري
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

  // باقي الملف (الـ JSX/الفورم) يفضل زي ما هو من غير أي تعديل
  // ...