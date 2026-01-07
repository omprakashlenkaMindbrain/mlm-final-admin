import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../../assets/bmpl.jpg"; // ✅ your uploaded logo
import { useAuth } from "../../context/Authcontext";
import { useSignup } from "../../hooks/auth/useSignup";

export default function AdminRegister() {
  const { adminSignup, loading, error, success } = useSignup();
  useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobno: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.mobno || !formData.password) {
      Swal.fire("Missing Fields", "Please fill in all fields", "warning");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Swal.fire("Invalid Email", "Please enter a valid email address", "error");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobno)) {
      Swal.fire("Invalid Number", "Please enter a valid 10-digit mobile number", "error");
      return;
    }

    if (formData.password.length < 8) {
      Swal.fire("Weak Password", "Password must be at least 8 characters", "info");
      return;
    }

    const result = await adminSignup(formData);

    if (result) {
      Swal.fire({
        title: "Success!",
        text: "Account created successfully!",
        icon: "success",
        confirmButtonColor: "#004aad",
      }).then(() => {
        setFormData({ name: "", email: "", mobno: "", password: "" });
        navigate("/admin/login");
      });
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm outline-none placeholder-gray-400 bg-transparent";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* ✅ Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-[#f3f8ff] to-[#e8f4ff]" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-[#004aad]/20">
          {/* ✅ Logo Header */}
          <div className="mb-6 text-center">
            <div className="flex justify-center mb-4">
              <img
                src={Logo}
                alt="BMPL Logo"
                className="w-20 h-20 object-contain rounded-full shadow-md border border-[#004aad]/30"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#004aad]">Create Account</h1>
            <p className="text-gray-600 text-sm mt-1">
              Join <span className="font-semibold text-[#fdbb2d]">BMPL</span> Admin Panel
            </p>
          </div>

          {/* ✅ Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-300 focus-within:border-[#004aad]">
              <User size={18} className="text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-2 border-b border-gray-300 focus-within:border-[#004aad]">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-2 border-b border-gray-300 focus-within:border-[#004aad]">
              <Phone size={18} className="text-gray-400" />
              <input
                type="tel"
                name="mobno"
                placeholder="Mobile Number"
                value={formData.mobno}
                onChange={handleChange}
                maxLength="10"
                className={inputClass}
              />
            </div>

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

            <div className="flex items-start gap-2 pt-2 text-sm text-gray-600">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-1 accent-[#004aad]"
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <a href="#" className="text-[#004aad] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#004aad] hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-[#004aad] hover:bg-[#00337a] text-white py-2 text-sm rounded-md font-medium mt-2 transition-all shadow-md"
            >
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight size={18} className="ml-2" />
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-center mt-2 text-sm">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-center mt-2 text-sm">
              Account created successfully!
            </p>
          )}

          <div className="mt-4 text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link
              to="/admin/login"
              className="text-[#004aad] hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
