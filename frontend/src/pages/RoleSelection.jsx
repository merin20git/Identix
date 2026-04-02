import { useNavigate } from "react-router-dom";
import { ShieldCheck, UserCircle, Shield, ArrowRight } from "lucide-react";

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="page flex items-center justify-center p-6 bg-[#f5f7fb]">
      <div className="w-full max-w-[900px]">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl shadow-lg shadow-primary/20 mb-6">
            <ShieldCheck className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-black text-ink tracking-tight mb-4">IDENTIX</h1>
          <p className="text-xl text-slate font-medium max-w-lg mx-auto">
            Secure Identification & Surveillance Terminal. Select your authorization level to proceed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Administrator Card */}
          <button 
            onClick={() => navigate("/login/admin")}
            className="group relative bg-white p-10 rounded-[40px] shadow-soft border-none text-left transition-all hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-150" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors">
                <Shield size={32} />
              </div>
              <h2 className="text-3xl font-black text-ink mb-4">Administrator</h2>
              <p className="text-slate font-medium mb-8 leading-relaxed">
                Full system access. Manage criminal records, missing person registries, and officer authorizations.
              </p>
              <div className="flex items-center gap-2 text-primary font-bold">
                <span>Access Terminal</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </button>

          {/* Officer Card */}
          <button 
            onClick={() => navigate("/login/officer")}
            className="group relative bg-white p-10 rounded-[40px] shadow-soft border-none text-left transition-all hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-150" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <UserCircle size={32} />
              </div>
              <h2 className="text-3xl font-black text-ink mb-4">Field Officer</h2>
              <p className="text-slate font-medium mb-8 leading-relaxed">
                Investigative tools access. Conduct suspect searches, analyze CCTV footage, and track missing persons.
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                <span>Open Dashboard</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        <div className="text-center mt-16 text-slate/40 text-sm font-bold tracking-widest uppercase">
          Department of Public Safety • Secure Authentication Protocol
        </div>
      </div>
    </div>
  );
}
