import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { apiRequest } from "../services/api";
import { 
  UserPlus, 
  Users, 
  Trash2, 
  ShieldCheck, 
  Lock, 
  User, 
  ShieldAlert,
  Search,
  Key,
  Mail
} from "lucide-react";

export default function ManageOfficers() {
  const [form, setForm] = useState({ username: "", password: "", full_name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [officers, setOfficers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  async function loadOfficers() {
    setListLoading(true);
    try {
      const data = await apiRequest("/admin/officers");
      setOfficers(data);
    } catch (err) {
      setError(err.message || "Failed to load officer list");
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    loadOfficers();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRequest("/admin/officers", { method: "POST", body: form });
      setForm({ username: "", password: "", full_name: "", email: "" });
      loadOfficers();
    } catch (err) {
      setError(err.message || "Failed to create officer account");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(username) {
    if (!confirm(`Are you sure you want to revoke access for ${username}?`)) return;
    setLoading(true);
    try {
      await apiRequest(`/admin/officers/${username}`, { method: "DELETE" });
      loadOfficers();
    } catch (err) {
      setError(err.message || "Failed to delete officer");
    } finally {
      setLoading(false);
    }
  }

  const filteredOfficers = officers.filter(o => 
    o.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="title-main mb-2">Officer Management</h2>
          <p className="text-xl text-slate font-medium">Provision and manage access for system operators.</p>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate" size={20} />
          <input 
            type="text" 
            placeholder="Search officers..." 
            className="input pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Add Officer */}
        <div className="lg:col-span-4">
          <div className="card sticky top-32">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <UserPlus size={20} />
              </div>
              <h3 className="title-section">New Officer</h3>
            </div>

            <form className="space-y-6" onSubmit={handleAdd}>
              <div>
                <label className="label">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate/40" size={18} />
                  <input
                    placeholder="e.g. jdoe_ops"
                    className="input pl-12"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate/40" size={18} />
                  <input
                    placeholder="Officer's legal name"
                    className="input pl-12"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate/40" size={18} />
                  <input
                    type="email"
                    placeholder="officer@agency.gov"
                    className="input pl-12"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Access Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate/40" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input pl-12"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button className="btn-primary w-full py-4 flex items-center justify-center gap-2" type="submit" disabled={loading}>
                {loading ? <Spinner size="sm" /> : <Key size={18} />}
                <span>{loading ? "Creating..." : "Create Account"}</span>
              </button>
              
              {error && (
                <div className="p-4 bg-red-50 text-alert rounded-xl border border-red-100 flex items-start gap-3">
                  <ShieldAlert className="shrink-0 w-5 h-5" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right: Officer List */}
        <div className="lg:col-span-8">
          <div className="card min-h-[600px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users size={20} />
              </div>
              <h3 className="title-section">Active Personnel</h3>
            </div>

            {listLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Spinner />
              </div>
            ) : filteredOfficers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-slate">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="text-xl font-bold text-ink">No officers found</p>
                <p className="font-medium">Verify the username or create a new account.</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="pb-4 font-bold text-slate uppercase tracking-wider text-xs">Officer Info</th>
                      <th className="pb-4 font-bold text-slate uppercase tracking-wider text-xs">Username</th>
                      <th className="pb-4 font-bold text-slate uppercase tracking-wider text-xs text-right">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOfficers.map((officer) => (
                      <tr key={officer.username} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary border border-blue-100 font-black text-lg">
                              {officer.full_name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-ink text-lg leading-none mb-1">{officer.full_name}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-slate uppercase tracking-widest">Active Operator</p>
                                {officer.email && (
                                  <>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-xs font-medium text-primary">{officer.email}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <code className="px-2 py-1 bg-gray-100 rounded text-slate font-bold text-sm">
                            @{officer.username}
                          </code>
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => handleDelete(officer.username)}
                            className="p-2 text-slate hover:text-alert hover:bg-red-50 rounded-lg transition-all"
                            title="Revoke Access"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
