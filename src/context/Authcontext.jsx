import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useLogin } from "../hooks/auth/useLogin";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { adminLogin } = useLogin();

  const [accessToken, setAccessToken] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [initializing, setInitializing] = useState(true); // 🔑 IMPORTANT
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ======================================================
     🔄 RESTORE SESSION ON PAGE REFRESH
  ====================================================== */
  useEffect(() => {
    const stored = localStorage.getItem("adminLogin");

    if (!stored) {
      setInitializing(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      if (parsed.accessToken && Date.now() < parsed.expiry) {
        setAccessToken(parsed.accessToken);
        setIsLoggedin(true);
      } else {
        localStorage.removeItem("adminLogin");
      }
    } catch {
      localStorage.removeItem("adminLogin");
    } finally {
      setInitializing(false);
    }
  }, []);

  /* ===================== LOGIN ===================== */
  const Login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const res = await adminLogin(credentials);

      if (!res?.success || !res.accessToken) {
        throw new Error("Invalid credentials");
      }

      setAccessToken(res.accessToken);
      setIsLoggedin(true);

      await Swal.fire({
        title: "Login Successful!",
        text: "Welcome back, Admin 🎉",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/admin");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed";

      setError(message);

      await Swal.fire({
        title: "Login Failed",
        text: message,
        icon: "error",
        confirmButtonColor: "#B63333",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ===================== LOGOUT ===================== */
  const Logout = async () => {
    localStorage.removeItem("adminLogin");
    setAccessToken(null);
    setIsLoggedin(false);

    await Swal.fire({
      title: "Logged Out",
      icon: "info",
      timer: 1200,
      showConfirmButton: false,
    });

    navigate("/admin/login");
  };

  /* ======================================================
     PREVENT APP FROM RENDERING BEFORE SESSION CHECK
  ====================================================== */
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Checking admin session…
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        Login,
        Logout,
        isLoggedin,
        accessToken, // ✅ SINGLE SOURCE OF TRUTH
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
