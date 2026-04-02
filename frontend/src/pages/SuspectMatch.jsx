import { useState } from "react";
import Spinner from "../components/Spinner";
import { apiRequest, mediaUrl } from "../services/api";
import { 
  UserCheck, 
  Upload, 
  Search, 
  ShieldAlert, 
  Zap,
  Target,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

export default function SuspectMatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
      setHasSearched(false);
      setResults([]);
    }
  };

  async function handleMatch(e) {
    e.preventDefault();
    const file = e.target.elements.image.files[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setResults([]);
    setHasSearched(true);
    
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const data = await apiRequest("/officer/suspect-match", { 
        method: "POST", 
        body: formData, 
        isForm: true 
      });
      setResults(data || []);
    } catch (err) {
      setError(err.message || "Face matching engine failed. Ensure image quality is high.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300 cursor-zoom-out"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            onClick={() => setFullscreenImage(null)}
          >
            <Zap size={40} />
          </button>
          <img 
            src={mediaUrl(fullscreenImage)} 
            alt="Fullscreen Detection" 
            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
          />
        </div>
      )}

      {selectedPerson && (
        <div className="fixed inset-0 bg-white z-[100] overflow-y-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="max-w-6xl mx-auto min-h-screen p-6 md:p-12">
            <div className="flex justify-between items-center mb-12 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-primary/10 rounded-3xl text-primary">
                  <ShieldCheck size={40} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-ink tracking-tight">Criminal Dossier</h2>
                  <p className="text-slate font-bold uppercase tracking-[0.2em] text-sm mt-1">Official Record: {selectedPerson.person_id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPerson(null)}
                className="group p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all flex items-center gap-3 text-slate font-bold"
              >
                <span>Close Dossier</span>
                <Zap size={24} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 mb-12">
              <div className="lg:col-span-5">
                <div className="sticky top-12">
                  <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-gray-50">
                    <img 
                      src={mediaUrl(selectedPerson.image_path)} 
                      alt={selectedPerson.person_name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-10">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <label className="text-xs font-black text-slate uppercase tracking-widest mb-3 block">Subject Name</label>
                    <p className="text-3xl font-bold text-ink">{selectedPerson.person_name}</p>
                  </div>
                  <div className="p-8 bg-red-50 rounded-[2rem] border border-red-100">
                    <label className="text-xs font-black text-alert uppercase tracking-widest mb-3 block">Primary Offense</label>
                    <p className="text-2xl font-bold text-ink">{selectedPerson.crime || "N/A"}</p>
                  </div>
                </div>

                <div className="p-10 bg-white rounded-[2.5rem] border-2 border-primary/10 shadow-xl shadow-primary/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    <Target size={120} className="text-primary/5 -mr-10 -mt-10" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-end mb-6">
                      <label className="text-xs font-black text-primary uppercase tracking-widest">Biometric Confidence</label>
                      <span className="text-5xl font-black text-primary tracking-tighter">{(selectedPerson.similarity * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-1">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${selectedPerson.similarity * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100 mb-12">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Zap size={28} className="animate-pulse" />
                  </div>
                  <h4 className="text-2xl font-black text-ink tracking-tight">Surveillance History Timeline</h4>
                </div>
                <div className="px-6 py-2 bg-white rounded-full border border-gray-200 text-xs font-black text-slate uppercase tracking-widest">
                  {selectedPerson.cctv_detections?.length || 0} Incident Matches
                </div>
              </div>

              {selectedPerson.cctv_detections && selectedPerson.cctv_detections.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {selectedPerson.cctv_detections.map((d, idx) => (
                    <div 
                      key={idx} 
                      className="group relative aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer"
                      onClick={() => setFullscreenImage(d.frame_path)}
                    >
                      <img 
                        src={mediaUrl(d.frame_path)} 
                        alt="Detection" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                          <p className="text-white text-xs font-black uppercase tracking-[0.2em]">Live Feed Match</p>
                        </div>
                        <p className="text-white text-lg font-bold">
                          {d.timestamp_ms > 0 ? `T-Mark: ${(d.timestamp_ms / 1000).toFixed(1)}s` : "Field ID Probe"}
                        </p>
                        <p className="text-white/50 text-xs font-medium mt-1 uppercase tracking-widest">Click to Expand Full View</p>
                      </div>
                      {idx === 0 && (
                        <div className="absolute top-6 left-6 px-4 py-2 bg-primary text-white text-xs font-black rounded-xl shadow-xl animate-bounce">
                          CRITICAL: LATEST
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-slate/30" />
                  </div>
                  <p className="text-xl font-bold text-ink">No Surveillance Record</p>
                  <p className="text-slate font-medium max-w-xs mx-auto mt-2">Subject biometric signature has not been previously logged in active surveillance sectors.</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-10 flex gap-6 mt-12">
              <button className="btn-primary flex-1 py-6 text-xl shadow-2xl shadow-primary/30 rounded-[2rem] flex items-center justify-center gap-3 font-black">
                <ShieldAlert size={28} />
                Dispatch Response Unit
              </button>
              <button 
                onClick={() => setSelectedPerson(null)}
                className="bg-white px-12 py-6 border-2 border-gray-100 rounded-[2rem] text-slate font-black text-xl hover:bg-gray-50 transition-all"
              >
                Exit Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="title-main mb-2">Suspect Detection</h2>
        <p className="text-xl text-slate font-medium">Instant facial recognition against the central criminal database.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Search Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Search size={20} />
              </div>
              <h3 className="title-section">Field Identification</h3>
            </div>

            <form onSubmit={handleMatch} className="space-y-6">
              <div className="relative group">
                <input 
                  type="file" 
                  name="image" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept="image/*"
                  required
                />
                {preview ? (
                  <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg group-hover:border-primary/50 transition-all">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold text-sm">Change Image</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 group-hover:border-primary/50 group-hover:bg-primary/5 rounded-2xl p-10 transition-all text-center">
                    <Upload className="mx-auto mb-4 text-slate group-hover:text-primary" size={32} />
                    <p className="text-ink font-bold mb-1">Upload Suspect Photo</p>
                    <p className="text-xs text-slate">Clear facial features required</p>
                  </div>
                )}
              </div>

              <button 
                className="btn-primary w-full py-4 flex items-center justify-center gap-2" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    <span>Run Identification</span>
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 text-alert rounded-xl border border-red-100 flex items-start gap-3">
                <ShieldAlert className="shrink-0 w-5 h-5" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}
          </div>

          <div className="card bg-blue-50/50 border-blue-100">
            <h4 className="font-bold text-primary flex items-center gap-2 mb-3">
              <Target size={18} />
              Accuracy Tips
            </h4>
            <ul className="text-xs space-y-2 text-slate font-medium">
              <li>• Use well-lit environment</li>
              <li>• Subject should look directly at camera</li>
              <li>• Avoid hats or sunglasses</li>
              <li>• Minimum resolution 640x480</li>
            </ul>
          </div>
        </div>

        {/* Right: Results Panel */}
        <div className="lg:col-span-8">
          <div className="card min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <UserCheck size={20} />
                </div>
                <h3 className="title-section">Identification Results</h3>
              </div>
              {results.length > 0 && (
                <div className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-black uppercase">
                  Match Found
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-[400px]">
                <div className="relative mb-6">
                  <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <Target className="absolute inset-0 m-auto text-primary animate-pulse" size={32} />
                </div>
                <p className="text-xl font-bold text-ink">Scanning Database...</p>
                <p className="text-slate font-medium">Running deep learning facial comparison</p>
              </div>
            ) : hasSearched && results.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-slate">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <ShieldAlert size={32} className="text-alert" />
                </div>
                <p className="text-xl font-bold text-ink">No Match Found</p>
                <p className="font-medium text-center max-w-xs">
                  The biometric signature does not match any records in the central criminal database.
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {results.map((item) => (
                  <div key={item.person_id} className="relative group overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                        {item.image_path ? (
                          <img
                            src={mediaUrl(item.image_path)}
                            alt={item.person_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate">
                            <UserCheck size={48} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-3xl font-black text-ink mb-1">{item.person_name}</h4>
                            <p className="text-sm font-black text-primary uppercase tracking-widest">Identified Suspect</p>
                          </div>
                          <div className="text-right">
                            <p className="text-4xl font-black text-primary leading-none">{(item.similarity * 100).toFixed(1)}%</p>
                            <p className="text-xs font-bold text-slate uppercase mt-1">Confidence Score</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs font-bold text-slate uppercase mb-1">Primary Crime</p>
                            <p className="font-bold text-ink text-lg">{item.crime || "N/A"}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs font-bold text-slate uppercase mb-1">Record Status</p>
                            <div className="flex items-center gap-2 text-red-600 font-bold">
                              <ShieldAlert size={16} />
                              <span>WANTED</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <button 
                            onClick={() => setSelectedPerson(item)}
                            className="btn-primary px-8 flex items-center gap-2"
                          >
                            <ShieldCheck size={18} />
                            Open Full Profile
                          </button>
                          <button className="btn-ghost p-3">
                            <ExternalLink size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-slate">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <UserCheck size={32} />
                </div>
                <p className="text-xl font-bold text-ink">Awaiting Input</p>
                <p className="font-medium text-center max-w-xs">
                  Upload a suspect photograph to begin identification process.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
