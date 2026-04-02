import { useState } from "react";
import Spinner from "../components/Spinner";
import { apiRequest, mediaUrl } from "../services/api";
import { 
  Search, 
  Users, 
  ShieldAlert, 
  ExternalLink,
  User,
  Fingerprint,
  FileText,
  ShieldCheck,
  Zap,
  Target
} from "lucide-react";

export default function SearchCriminal() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const data = await apiRequest(`/officer/criminals/search?name=${encodeURIComponent(query)}`);
      setResults(data);
    } catch (err) {
      setError(err.message || "Database query failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      {selectedPerson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-ink">Criminal Dossier</h2>
                    <p className="text-slate font-bold uppercase tracking-widest text-xs">Official Record: {String(selectedPerson.id || "").slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPerson(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-slate"
                >
                  <Zap size={24} className="rotate-45" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
                  <img 
                    src={mediaUrl(selectedPerson.image_path)} 
                    alt={selectedPerson.full_name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black text-slate uppercase tracking-tighter">Subject Name</label>
                    <p className="text-2xl font-bold text-ink">{selectedPerson.full_name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate uppercase tracking-tighter">Primary Offense</label>
                    <p className="text-lg font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg inline-block">{selectedPerson.crime || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate uppercase tracking-tighter">Database Status</label>
                    <p className="text-lg font-bold text-primary px-3 py-1 rounded-lg inline-block">VERIFIED RECORD</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h4 className="font-bold text-ink mb-4 flex items-center gap-2">
                  <Target size={18} className="text-primary" />
                  Database Record Details
                </h4>
                <div className="space-y-3 text-sm text-slate font-medium leading-relaxed">
                  <p>• Subject is currently listed in the master criminal database with active warrants.</p>
                  <p>• Offense details: {selectedPerson.crime || "Not specified"}.</p>
                  <p>• Last known location: {selectedPerson.last_known_location || "Unknown"}.</p>
                  <p>• Protocol: Authorized personnel only. Any field action must be logged in the system.</p>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button className="btn-primary flex-1 py-4 text-lg shadow-lg shadow-primary/20">
                  Generate Official Report
                </button>
                <button 
                  onClick={() => setSelectedPerson(null)}
                  className="btn-ghost px-8 border-gray-200"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="title-main mb-2">Criminal Search</h2>
        <p className="text-xl text-slate font-medium">Search the master criminal database by name or alias.</p>
      </div>

      <div className="card">
        <form className="flex flex-col gap-6 md:flex-row md:items-end" onSubmit={handleSearch}>
          <div className="flex-1">
            <label className="label">Search Query</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate/40" size={20} />
              <input
                placeholder="Enter suspect name or ID..."
                className="input pl-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </div>
          </div>
          <button className="btn-primary px-10 h-[52px] flex items-center gap-2" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : <Fingerprint size={20} />}
            <span>{loading ? "Searching..." : "Execute Search"}</span>
          </button>
        </form>
        {error && (
          <div className="mt-6 p-4 bg-red-50 text-alert rounded-xl border border-red-100 flex items-start gap-3">
            <ShieldAlert className="shrink-0 w-5 h-5" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}
      </div>

      <div className="card min-h-[500px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-ink/10 rounded-lg text-ink">
            <Users size={20} />
          </div>
          <h3 className="title-section">Database Results</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Spinner />
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-slate">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search size={32} />
            </div>
            <p className="text-xl font-bold text-ink">No results to display</p>
            <p className="font-medium">Perform a search to see matches from the database.</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-4 font-bold text-slate uppercase tracking-wider text-xs">Suspect Profile</th>
                  <th className="pb-4 font-bold text-slate uppercase tracking-wider text-xs">Primary Charge</th>
                  <th className="pb-4 font-bold text-slate uppercase tracking-wider text-xs text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                          {item.image_path ? (
                            <img
                              src={mediaUrl(item.image_path)}
                              alt={item.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate">
                              <User size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-ink text-lg leading-none mb-1">{item.full_name}</p>
                          <p className="text-xs font-black text-slate uppercase tracking-widest">ID: {String(item.id || "").slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-red-50 text-alert rounded-full text-xs font-black uppercase tracking-tighter">
                        {item.crime || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedPerson(item)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white rounded-lg text-slate font-bold text-sm transition-all"
                        >
                          <FileText size={16} />
                          <span>Dossier</span>
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
