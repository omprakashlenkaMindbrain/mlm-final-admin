import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/Authcontext";
import { ProtectedRoute } from "../context/ProtectedRoute";
import AccountComponent from "../pages/accountcomponent/AccountComponenet";
import AdminLoginPage from "../pages/authentication/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import IncomeJenerate from "../pages/incoomejenerate/IncomeJenerate";
import Payout from "../pages/payout/Payout";
import PayoutHistory from "../pages/payoutHistory/PayoutHistory";
import UserTree from "../pages/usertree/UserTree";
import AllUsers from "../pages/incomehistory/incomeHistory";

function Layout() {
  const location = useLocation();

  const hideNavRoute = ["/admin/login"];
  const showNavbar = !hideNavRoute.includes(location.pathname);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      {showNavbar && (
        <ProtectedRoute>
          <Navbar className="fixed top-0 left-0 h-full w-64 z-50" />
        </ProtectedRoute>
      )}

      {/* Main content */}
      <main
        className={`
          flex-1 transition-all duration-300
          ${showNavbar ? "md:ml-64" : ""}
          p-4 md:p-6
          overflow-auto
        `}
      >
        <div className="max-w-7xl mx-auto w-full">
          <Routes>
            {/* Redirect /admin → dashboard */}
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

            <Route
              path="/income-history"
              element={
                <ProtectedRoute>
                  <AllUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payout-history"
              element={
                <ProtectedRoute>
                  <PayoutHistory />
                </ProtectedRoute>
              }
            />

            {/* Single login route */}
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
