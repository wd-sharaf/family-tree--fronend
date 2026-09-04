import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterForm from "./components/RegisterForm"; // استيراد مكون التسجيل
import TreePage from "./pages/TreePage";
import PersonFormPage from "./pages/PersonFormPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterForm />} /> {/* مسار التسجيل الجديد */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TreePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/person/new"
        element={
          <ProtectedRoute>
            <PersonFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/person/:id/edit"
        element={
          <ProtectedRoute>
            <PersonFormPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}