import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/Authcontext";
import { ProtectedRoute } from "../context/ProtectedRoute";
import AdminLoginPage from "../pages/authentication/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import IncomeJenerate from "../pages/incoomejenerate/IncomeJenerate";
import Payout from "../pages/payout/Payout";
import UserTree from "../pages/usertree/UserTree";
import AccountComponent from "../pages/accountcomponent/AccountComponenet";

function Layout() {
  const location = useLocation();

  const hideNavRoute = ["/admin/login"];
  const showNavbar = !hideNavRoute.includes(location.pathname);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {showNavbar && (
        <ProtectedRoute>
          <Navbar />
        </ProtectedRoute>
      )}

      <main
        className={`
          flex-1 transition-all duration-300
          ${showNavbar ? "md:ml-64" : ""}
          ${showNavbar ? "mt-16 md:mt-0" : ""}
          p-4 md:p-6
        `}
      >
        <div className="max-w-7xl mx-auto w-full">
          <Routes>
            {/* ✅ FIX: redirect /admin → dashboard */}
            <Route path="/admin" element={<Navigate to="/" replace />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/change-scanner"
              element={
                <ProtectedRoute>
                  <AccountComponent />
                </ProtectedRoute>
              }
            />

            <Route
              path="/income-generate"
              element={
                <ProtectedRoute>
                  <IncomeJenerate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payout"
              element={
                <ProtectedRoute>
                  <Payout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user-tree"
              element={
                <ProtectedRoute>
                  <UserTree />
                </ProtectedRoute>
              }
            />

            {/* ✅ SINGLE login route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function RouterManage() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default RouterManage;
