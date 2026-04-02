import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { apiRequest, mediaUrl } from "../services/api";
import { 
  UserPlus, 
  Users, 
  Trash2, 
  Search, 
  Upload, 
  ShieldAlert,
  MapPin,
  ExternalLink,
  Heart,
  Zap,
  Target
} from "lucide-react";

export default function MissingPersons() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ full_name: "", last_seen: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [detections, setDetections] = useState([]);
  const [detectionsLoading, setDetectionsLoading] = useState(false);

  async function loadMissing() {
    setLoading(true);
    try {
      const data = await apiRequest("/officer/missing");
      setItems(data);
    } catch (err) {
      setError(err.message || "Failed to load records");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMissing();
  }, []);

  useEffect(() => {
    if (selectedPerson) {
      loadDetections(selectedPerson._id || selectedPerson.id);
    } else {
      setDetections([]);
    }
  }, [selectedPerson]);

  async function loadDetections(personId) {
    setDetectionsLoading(true);
    try {
      const data = await apiRequest(`/officer/missing/${personId}/cctv-detections`);
      setDetections(data);
    } catch (err) {
      console.error("Failed to load detections", err);
    } finally {
      setDetectionsLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    const file = e.target.elements.image.files[0];
    if (!file) return;

    setError("");
    const formData = new FormData();
    formData.append("full_name", form.full_name);
    formData.append("last_seen", form.last_seen);
    formData.append("image", file);
    
    try {
      await apiRequest("/officer/missing", { 
        method: "POST", 
        body: formData, 
        isForm: true 
      });
      setForm({ full_name: "", last_seen: "" });
      setFileName("");
      e.target.reset();
      loadMissing();
    } catch (err) {
      setError(err.message || "Failed to add missing person record");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this missing person record?")) return;
    try {
      await apiRequest(`/officer/missing/${id}`, { method: "DELETE" });
      loadMissing();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  }

  const filteredItems = Array.isArray(items) ? items.filter(item => 
    (item.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.last_seen || "").toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="space-y-10">
      {selectedPerson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-action/10 rounded-2xl text-action">
                    <Heart size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-ink">Missing Person Alert</h2>
                    <p className="text-slate font-bold uppercase tracking-widest text-xs">Case File: {String(selectedPerson._id || selectedPerson.id || "").slice(-8).toUpperCase()}</p>
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
                    <label className="text-xs font-black text-slate uppercase tracking-tighter">Person Name</label>
                    <p className="text-2xl font-bold text-ink">{selectedPerson.full_name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate uppercase tracking-tighter">Last Seen At</label>
                    <p className="text-lg font-bold text-action bg-amber-50 px-3 py-1 rounded-lg inline-block">{selectedPerson.last_seen || "Unknown"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate uppercase tracking-tighter">Alert Status</label>
                    <p className="text-lg font-bold text-action px-3 py-1 rounded-lg inline-block">ACTIVE SEARCH</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-bold text-ink mb-4 flex items-center gap-2">
                    <Target size={18} className="text-action" />
                    Verification Protocol
                  </h4>
                  <div className="space-y-3 text-sm text-slate font-medium leading-relaxed">
                    <p>• This subject is currently listed in the active missing persons database.</p>
                    <p>• Reported last seen at: {selectedPerson.last_seen || "Not specified"}.</p>
                    <p>• Action: If a match is identified in the field, ensure individual safety and contact the family liaison officer immediately.</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-bold text-ink mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-action" />
                    CCTV Detections
                  </h4>
                  {detectionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Spinner size="sm" />
                    </div>
                  ) : detections.length === 0 ? (
                    <p className="text-sm text-slate font-medium">No CCTV detections found for this person yet.</p>
                  ) : (
                    <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {detections.map((d, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                            <img src={mediaUrl(d.frame_path)} alt="Detection" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-ink truncate">{(d.similarity * 100).toFixed(1)}% Match</p>
                            <p className="text-[10px] font-bold text-slate">Timestamp: {(d.timestamp_ms / 1000).toFixed(1)}s</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button className="btn-action flex-1 py-4 text-lg shadow-lg shadow-action/20">
                  Notify Case Officer
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

      <div className="flex justify-between items-end">
        <div>
          <h2 className="title-main mb-2">Missing Persons</h2>
          <p className="text-xl text-slate font-medium">Coordinate search efforts and track missing person reports.</p>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            className="input pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Add Form */}
        <div className="lg:col-span-4">
          <div className="card sticky top-32 border-action/20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-action/10 rounded-lg text-action">
                <UserPlus size={20} />
              </div>
              <h3 className="title-section">Report Missing</h3>
            </div>

            <form className="space-y-6" onSubmit={handleAdd}>
              <div>
                <label className="label">Full Name</label>
                <input
                  placeholder="Enter missing person's name"
                  className="input"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Last Seen At</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate/40" size={18} />
                  <input
                    placeholder="Location, Date/Time"
                    className="input pl-12"
                    value={form.last_seen}
                    onChange={(e) => setForm({ ...form, last_seen: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">Recent Photograph</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    name="image" 
                    onChange={(e) => setFileName(e.target.files[0]?.name || "")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*"
                    required
                  />
                  <div className="border-2 border-dashed border-gray-200 group-hover:border-action/50 group-hover:bg-action/5 rounded-xl p-6 transition-all text-center">
                    <Upload className="mx-auto mb-2 text-slate group-hover:text-action" size={24} />
                    <p className="text-sm font-bold text-ink">
                      {fileName || "Upload Image"}
                    </p>
                  </div>
                </div>
              </div>
              
              <button className="btn-action w-full py-4" type="submit">
                Submit Alert
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

        {/* Right: Table */}
        <div className="lg:col-span-8">
          <div className="card min-h-[600px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-action/10 rounded-lg text-action">
                <Users size={20} />
              </div>
              <h3 className="title-section">Missing Records</h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Spinner />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-slate">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="text-xl font-bold text-ink">No records found</p>
                <p className="font-medium">Try searching for another person.</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="pb-4 font-bold text-slate uppercase tracking-wider text-xs">Person Info</th>
                      <th className="pb-4 font-bold text-slate uppercase tracking-wider text-xs">Last Seen</th>
                      <th className="pb-4 font-bold text-slate uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredItems.map((item) => (
                      <tr key={item._id || item.id} className="group hover:bg-gray-50/50 transition-colors">
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
                                  <Users size={20} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-ink text-lg">{item.full_name}</p>
                              <p className="text-xs font-black text-slate uppercase tracking-widest">ALERT: {String(item._id || item.id || "").slice(-6).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2 text-slate font-medium">
                            <MapPin size={14} className="text-action" />
                            <span>{item.last_seen}</span>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedPerson(item)}
                              className="p-2 text-slate hover:text-action hover:bg-action/5 rounded-lg transition-all"
                            >
                              <ExternalLink size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(item._id || item.id)}
                              className="p-2 text-slate hover:text-alert hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
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
      </div>
    </div>
  );
}
