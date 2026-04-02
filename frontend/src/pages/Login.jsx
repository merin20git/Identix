import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { loginUser, setToken, decodeToken } from "../services/api";
import Spinner from "../components/Spinner";
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, ChevronLeft, Shield, UserCircle } from "lucide-react";

export default function Login() {
  const { role } = useParams(); // 'admin' or 'officer'
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const is_admin = role === "admin";
  const display_role = is_admin ? "Administrator" : "Officer";
  const RoleIcon = is_admin ? Shield : UserCircle;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(form);
      setToken(data.access_token);
      const payload = decodeToken(data.access_token);
      
      // Ensure they logged into the correct portal
      if (payload?.role !== role && role !== undefined) {
        throw new Error(`Unauthorized: This portal is for ${display_role}s only.`);
      }

      if (payload?.role === "admin") navigate("/admin");
      else if (payload?.role === "officer") navigate("/officer");
      else navigate("/");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page flex items-center justify-center p-6 bg-[#f5f7fb]">
      <div className="w-full max-w-[480px]">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate font-bold mb-8 hover:text-primary transition-colors group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Selection</span>
        </Link>

        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center w-20 h-20 ${is_admin ? 'bg-primary' : 'bg-blue-600'} rounded-3xl shadow-lg mb-6 text-white`}>
            <RoleIcon size={40} />
          </div>
          <h1 className="text-4xl font-black text-ink tracking-tight mb-2 uppercase">{display_role} Login</h1>
          <p className="text-lg text-slate font-medium">IDENTIX Secure Identification Terminal</p>
        </div>

        <div className="card shadow-soft p-10 border-none">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ink">Authorized Access Only</h2>
            <p className="text-slate font-medium">Enter your {display_role} credentials.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="label">{display_role} Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate/40" size={20} />
                <input
                  className="input pl-12"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder={`e.g. ${is_admin ? 'admin_ops' : 'officer_721'}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Access Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate/40" size={20} />
                <input
                  type="password"
                  className="input pl-12"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-alert rounded-xl border border-red-100 flex items-start gap-3">
                <AlertCircle className="shrink-0 w-5 h-5 mt-0.5" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              className={`w-full py-4 flex items-center justify-center gap-2 text-lg shadow-lg font-bold rounded-2xl text-white transition-all ${is_admin ? 'bg-primary hover:bg-primary/90 shadow-primary/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Initialize {display_role} Session</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate font-medium">
            System monitored for auditing and compliance purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
