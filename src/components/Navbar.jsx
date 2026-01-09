import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/bmpl.jpg";
import { useAuth } from "../context/Authcontext";
import { getAdmin } from "../hooks/auth/getAdmin";

export default function Navbar({ closeSidebar }) {
  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Change-Scanner", path: "/change-scanner" },
    { name: "User-Tree", path: "/user-tree" },
    { name: "Income-Generate", path: "/income-generate" },
    { name: "Payout", path: "/payout" },
    { name: "Income Hiistory", path: "/income-history" },
    { name: "Payout Hiistory", path: "/payout-history" },


  ];

  const { Logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ name: "Admin", loginDate: "" });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const { getAdminInfo } = getAdmin();
        const res = await getAdminInfo();

        const adminData = res?.data?.admin || {};

        setAdminInfo({
          name: adminData.name || "Admin",
          loginDate: adminData.createdAt
            ? new Date(adminData.createdAt).toLocaleString()
            : "Active",
        });
      } catch (err) {
        console.error("Failed to load admin info");
      }
    };

    fetchAdmin();
  }, []);


  const handleLogout = () => {
    Logout();
    navigate("/admin/login");
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (closeSidebar) closeSidebar();
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-[#002b5c] to-[#0058a3] text-white flex-col justify-between shadow-2xl transition-all z-40">
        <div>
          {/* Logo */}
          <div
            className="flex items-center gap-3 p-5 border-b border-white/20 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="BMPL Logo"
              className="w-12 h-12 rounded-md border-2 border-white object-cover shadow-md"
            />
            <span className="font-bold text-2xl tracking-wide">BMPL Admin</span>
          </div>

          {/* Nav Items */}
          <div className="flex flex-col mt-6 space-y-1 px-3">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center gap-3 rounded-md px-4 py-3 transition-all duration-200 ${location.pathname === item.path
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:bg-white/10"
                  }`}
              >
                <span className="text-lg">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-5 border-t border-white/20">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <User size={20} />
              </div>
              <div>
                <p className="font-semibold text-white">{adminInfo.name}</p>
                <p className="text-xs text-white/70">
                  {adminInfo.loginDate || "Active"}
                </p>
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`transition-transform ${profileDropdownOpen ? "rotate-180" : ""
                }`}
            />
          </div>

          {profileDropdownOpen && (
            <div className="mt-3 bg-white/10 rounded-md p-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-red-300 hover:text-red-500 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Top Navbar (Mobile) */}
      <nav className="md:hidden w-full bg-gradient-to-r from-[#003366] to-[#0058a3] shadow-md fixed top-0 left-0 z-50">
        <div className="px-6 py-3 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="BMPL Logo"
              className="w-10 h-10 rounded-md border-2 border-white object-cover"
            />
            <span className="text-white font-semibold text-xl tracking-wide">
              BMPL Admin
            </span>
          </div>

          <button
            className="text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="bg-white shadow-xl rounded-b-lg py-3 px-4 animate-fade-in">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left py-3 font-medium rounded-md transition ${location.pathname === item.path
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-800 hover:bg-gray-100"
                  }`}
              >
                {item.name}
              </button>
            ))}

            <hr className="my-2" />
            <button
              onClick={handleLogout}
              className="w-full text-left text-red-600 hover:bg-red-50 py-2 rounded-md transition flex items-center gap-2"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
