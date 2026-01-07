import { ArrowRight, Eye, EyeOff, Lock, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../../assets/bmpl.jpg";
import { useAuth } from "../../context/Authcontext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { Login, isLoggedin, loading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    mobno: "",
    password: "",
  });

  useEffect(() => {
    if (isLoggedin) navigate("/");
  }, [isLoggedin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mobno || !formData.password) {
      Swal.fire("Missing Fields", "Please fill in all fields", "warning");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobno)) {
      Swal.fire("Invalid Phone", "Please enter a valid 10-digit phone number", "error");
      return;
    }

    try {
      await Login(formData);
    } catch (err) {
      console.error(err);
      Swal.fire("Login Failed", err?.message || "Unable to login. Please try again.", "error");
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm outline-none placeholder-gray-400 bg-transparent";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* ✅ Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-[#f3f8ff] to-[#e8f4ff]" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-[#004aad]/20">
          {/* ✅ Header with Logo */}
          <div className="mb-6 text-center">
            <div className="flex justify-center mb-4">
              <img
                src={Logo}
                alt="BMPL Logo"
                className="w-20 h-20 object-contain rounded-full shadow-md border border-[#004aad]/30"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#004aad] mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm">
              Sign in to your{" "}
              <span className="font-semibold text-[#fdbb2d]">BMPL</span> Admin Panel
            </p>
          </div>

          {/* ✅ Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone input */}
            <div className="flex items-center gap-2 border-b border-gray-300 focus-within:border-[#004aad]">
              <Phone size={18} className="text-gray-400" />
              <input
                type="tel"
                name="mobno"
                placeholder="Phone Number"
                value={formData.mobno}
                onChange={handleChange}
                maxLength="10"
                className={inputClass}
              />
            </div>

            {/* Password input */}
            <div className="flex items-center gap-2 border-b border-gray-300 focus-within:border-[#004aad] relative">
              <Lock size={18} className="text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm pr-10 outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-[#004aad] hover:bg-[#00337a] text-white py-2 text-sm rounded-md font-medium mt-2 transition-all shadow-md"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={18} className="ml-2" />}
            </button>

            {error && (
              <p className="text-red-500 text-center text-sm mt-2">{error}</p>
            )}
          </form>

          {/* ✅ Footer */}
          {/* <div className="mt-4 text-center text-gray-500 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/admin/register"
              className="text-[#004aad] hover:underline font-medium"
            >
              Register
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}
