import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Criminals from "./pages/Criminals";
import MissingPersons from "./pages/MissingPersons";
import UploadCCTV from "./pages/UploadCCTV";
import ManageOfficers from "./pages/ManageOfficers";
import OfficerDashboard from "./pages/OfficerDashboard";
import SuspectMatch from "./pages/SuspectMatch";
import MissingMatch from "./pages/MissingMatch";
import SearchCriminal from "./pages/SearchCriminal";
import EmailSettings from "./pages/EmailSettings";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import { clearToken, getRole, getToken } from "./services/api";

import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Cctv, 
  Settings, 
  LogOut, 
  ShieldAlert,
  Search,
  UserCheck,
  Mail
} from "lucide-react";

const adminNav = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Criminal Database", to: "/admin/criminals", icon: Users },
  { label: "CCTV Monitoring", to: "/admin/cctv", icon: Cctv },
  { label: "Officer Tools", to: "/admin/officers", icon: UserPlus },
  { label: "Email Alerts", to: "/admin/email-settings", icon: Mail },
  { label: "Logout", key: "logout", icon: LogOut }
];

const officerNav = [
  { label: "Suspect Detection", to: "/officer/suspect", icon: UserCheck },
  { label: "Missing Persons", to: "/officer/missing-manage", icon: Users },
  { label: "Missing Person Match", to: "/officer/missing", icon: ShieldAlert },
  { label: "Search Criminal", to: "/officer/search", icon: Search },
  { label: "Logout", key: "logout", icon: LogOut }
];

function Layout({ items, children }) {
  const navigate = useNavigate();
  const enriched = items.map((item) =>
    item.key === "logout"
      ? {
          ...item,
          onClick: () => {
            clearToken();
            navigate("/");
          }
        }
      : item
  );

  return (
    <div className="page flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={enriched} />
        <main className="flex-1 bg-background p-10 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

function RoleRedirect() {
  const token = getToken();
  if (!token) return <RoleSelection />;
  const role = getRole();
  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "officer") return <Navigate to="/officer" replace />;
  return <RoleSelection />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/login" element={<Navigate to="/" replace />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allow={["admin"]}>
            <Layout items={adminNav}>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/criminals"
        element={
          <ProtectedRoute allow={["admin"]}>
            <Layout items={adminNav}>
              <Criminals />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/cctv"
        element={
          <ProtectedRoute allow={["admin"]}>
            <Layout items={adminNav}>
              <UploadCCTV />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/officers"
        element={
          <ProtectedRoute allow={["admin"]}>
            <Layout items={adminNav}>
              <ManageOfficers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/email-settings"
        element={
          <ProtectedRoute allow={["admin"]}>
            <Layout items={adminNav}>
              <EmailSettings />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/officer"
        element={
          <ProtectedRoute allow={["officer"]}>
            <Layout items={officerNav}>
              <OfficerDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/missing-manage"
        element={
          <ProtectedRoute allow={["officer"]}>
            <Layout items={officerNav}>
              <MissingPersons />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/suspect"
        element={
          <ProtectedRoute allow={["officer"]}>
            <Layout items={officerNav}>
              <SuspectMatch />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/missing"
        element={
          <ProtectedRoute allow={["officer"]}>
            <Layout items={officerNav}>
              <MissingMatch />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/search"
        element={
          <ProtectedRoute allow={["officer"]}>
            <Layout items={officerNav}>
              <SearchCriminal />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
