import { useState } from "react";
import Spinner from "../components/Spinner";
import { apiRequest, mediaUrl } from "../services/api";
import { 
  Upload, 
  Video, 
  History, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  User,
  Zap,
  ShieldCheck,
  Target
} from "lucide-react";

export default function UploadCCTV() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchFor, setSearchFor] = useState("all");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFileNames(files.map(f => f.name));
    }
  };

  async function handleUpload(e) {
    e.preventDefault();
    const files = e.target.elements.footage.files;
    if (files.length === 0) return;

    setError("");
    setLoading(true);
    setResults([]);
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("footages", files[i]);
    }
    
    try {
      const data = await apiRequest(`/admin/cctv?search_for=${searchFor}`, { 
        method: "POST", 
        body: formData, 
        isForm: true 
      });
      // Handle the new response format which might be a list of results
      const allMatches = Array.isArray(data) 
        ? data.flatMap(res => res.matches || [])
        : (data.matches || []);
      setResults(allMatches);
    } catch (err) {
      setError(err.message || "Analysis failed. Please check the video format.");
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
                    <h2 className="text-3xl font-black text-ink">Person Dossier</h2>
                    <p className="text-slate font-bold uppercase tracking-widest text-xs">Detection ID: {selectedPerson.person_id.slice(-8).toUpperCase()}</p>
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
                <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                  <img 
                    src={mediaUrl(selectedPerson.frame_path)} 
                    alt={selectedPerson.person_name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black text-slate uppercase tracking-tighter">Identified As</label>
                    <p className="text-2xl font-bold text-ink">{selectedPerson.person_name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate uppercase tracking-tighter">Detection Timestamp</label>
                    <p className="text-lg font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg inline-block">{(selectedPerson.timestamp_ms / 1000).toFixed(2)}s</p>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate uppercase tracking-tighter">Match Confidence</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: `${selectedPerson.similarity * 100}%` }}
                        />
                      </div>
                      <span className="font-black text-primary">{(selectedPerson.similarity * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button className="btn-primary flex-1 py-4 text-lg shadow-lg shadow-primary/20">
                  Export Detection Clip
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
        <h2 className="title-main mb-2">CCTV Monitoring</h2>
        <p className="text-xl text-slate font-medium">Upload footage for automated facial recognition and person tracking.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Upload Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Video size={20} />
              </div>
              <h3 className="title-section">Footage Upload</h3>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-ink mb-2">Analysis Target</label>
                <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
                  <button type="button" onClick={() => setSearchFor("all")} className={`flex-1 py-2 px-3 text-sm font-bold rounded-md transition-colors ${searchFor === 'all' ? 'bg-white shadow-sm text-primary' : 'text-slate hover:bg-white/50'}`}>All</button>
                  <button type="button" onClick={() => setSearchFor("criminals")} className={`flex-1 py-2 px-3 text-sm font-bold rounded-md transition-colors ${searchFor === 'criminals' ? 'bg-white shadow-sm text-primary' : 'text-slate hover:bg-white/50'}`}>Criminals</button>
                  <button type="button" onClick={() => setSearchFor("missing")} className={`flex-1 py-2 px-3 text-sm font-bold rounded-md transition-colors ${searchFor === 'missing' ? 'bg-white shadow-sm text-primary' : 'text-slate hover:bg-white/50'}`}>Missing</button>
                </div>
              </div>

              <div className="relative group">
                <input 
                  type="file" 
                  name="footage" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept="video/*"
                  multiple
                  required
                />
                <div className="border-2 border-dashed border-gray-200 group-hover:border-primary/50 group-hover:bg-primary/5 rounded-2xl p-8 transition-all text-center">
                  <div className="w-16 h-16 bg-gray-50 group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                    <Upload className="text-slate group-hover:text-primary" />
                  </div>
                  <div className="text-ink font-bold mb-1 max-h-32 overflow-y-auto">
                    {fileNames.length > 0 ? (
                      <ul className="text-sm">
                        {fileNames.map((name, i) => (
                          <li key={i} className="truncate">{name}</li>
                        ))}
                      </ul>
                    ) : (
                      "Click to upload videos"
                    )}
                  </div>
                  <p className="text-sm text-slate">{fileNames.length > 0 ? `${fileNames.length} files selected` : "MP4, AVI or MOV (Max 100MB)"}</p>
                </div>
              </div>

              <button 
                className="btn-primary w-full flex items-center justify-center gap-2 py-4" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span>Analyzing Frames...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    <span>Start AI Analysis</span>
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 text-alert rounded-xl border border-red-100 flex items-start gap-3">
                <AlertCircle className="shrink-0 w-5 h-5 mt-0.5" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}
          </div>

          <div className="card bg-ink text-white border-none">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-400" />
              Analysis Features
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">• Multi-face tracking</li>
              <li className="flex items-center gap-2">• Criminal database matching</li>
              <li className="flex items-center gap-2">• Missing person identification</li>
              <li className="flex items-center gap-2">• Timestamp logging</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Results Timeline */}
        <div className="lg:col-span-8">
          <div className="card min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-action/10 rounded-lg text-action">
                  <History size={20} />
                </div>
                <h3 className="title-section">Detection Results</h3>
              </div>
              {results.length > 0 && (
                <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                  {results.length} Matches Found
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-slate">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <Video className="absolute inset-0 m-auto text-primary" size={24} />
                </div>
                <p className="text-xl font-bold text-ink">AI Engine is processing footage</p>
                <p className="font-medium">Comparing faces against 5,000+ records...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-slate">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <History size={32} />
                </div>
                <p className="text-xl font-bold text-ink">No detections yet</p>
                <p className="font-medium">Upload a video to see real-time matches.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {results.map((item, idx) => (
                  <div key={`${item.person_id}-${idx}`} className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-video relative overflow-hidden">
                      {item.frame_path && (
                        <img
                          src={mediaUrl(item.frame_path)}
                          alt={item.person_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-xs font-black rounded-full shadow-lg">
                        {(item.similarity * 100).toFixed(1)}% MATCH
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <User size={18} className="text-slate" />
                        </div>
                        <div>
                          <h4 className="font-bold text-ink text-lg leading-none mb-1">{item.person_name}</h4>
                          <p className="text-xs font-bold text-slate uppercase tracking-wider">Identified Suspect</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-slate">
                          <Clock size={14} />
                          <span className="text-sm font-bold">{(item.timestamp_ms / 1000).toFixed(2)}s</span>
                        </div>
                        <button 
                          onClick={() => setSelectedPerson(item)}
                          className="text-primary text-sm font-bold hover:underline"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
