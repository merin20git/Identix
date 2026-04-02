import { useNavigate } from "react-router-dom";
import { clearToken, getRole, getUser } from "../services/api";
import { LogOut, Activity, User, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const role = getRole();
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-primary p-2 rounded-xl">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">IDENTIX</h1>
          <p className="text-xs font-semibold text-slate uppercase tracking-wider">Intelligent Surveillance</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full border border-green-100">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-bold uppercase">System Online</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pr-4 border-r border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5 text-slate" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-ink leading-none mb-1">{user?.full_name || "Admin"}</p>
              <p className="text-xs font-medium text-slate capitalize">{role}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-slate hover:text-alert hover:bg-red-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
