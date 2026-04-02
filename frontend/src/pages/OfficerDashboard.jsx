import { Link } from "react-router-dom";
import { 
  UserCheck, 
  ShieldAlert, 
  Search, 
  ChevronRight, 
  ShieldCheck,
  Clock,
  Activity
} from "lucide-react";

function QuickAction({ to, title, description, icon: Icon, colorClass }) {
  return (
    <Link to={to} className="card group hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${colorClass} text-white`}>
          <Icon size={32} />
        </div>
        <ChevronRight className="text-slate group-hover:text-primary transition-colors" />
      </div>
      <h3 className="title-section mb-2">{title}</h3>
      <p className="text-slate font-medium leading-relaxed">{description}</p>
    </Link>
  );
}

export default function OfficerDashboard() {
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="title-main mb-2">Officer Command Center</h2>
          <p className="text-xl text-slate font-medium">Access specialized tools for field identification and suspect matching.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full border border-green-100 font-bold text-sm">
          <Activity size={16} className="animate-pulse" />
          Live Session Active
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <QuickAction 
          to="/officer/suspect"
          title="Suspect Detection"
          description="Upload field photos to run instant matches against the global criminal database."
          icon={UserCheck}
          colorClass="bg-primary"
        />
        <QuickAction 
          to="/officer/missing"
          title="Missing Person Match"
          description="Verify identity of found individuals against active missing person alerts."
          icon={ShieldAlert}
          colorClass="bg-action"
        />
        <QuickAction 
          to="/officer/search"
          title="Criminal Search"
          description="Query the database by name or identifier for rapid background checks."
          icon={Search}
          colorClass="bg-ink"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card bg-slate-50 border-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ShieldCheck className="text-primary" size={20} />
            </div>
            <h3 className="title-section text-xl">Operational Protocols</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3 text-slate">
              <span className="font-bold text-primary">01.</span>
              <p className="text-sm font-medium">Always verify AI confidence scores above 85% before taking field action.</p>
            </li>
            <li className="flex gap-3 text-slate">
              <span className="font-bold text-primary">02.</span>
              <p className="text-sm font-medium">Mugshot uploads must be clear and front-facing for optimal identification.</p>
            </li>
            <li className="flex gap-3 text-slate">
              <span className="font-bold text-primary">03.</span>
              <p className="text-sm font-medium">All searches and matches are logged for auditing and legal compliance.</p>
            </li>
          </ul>
        </div>

        <div className="card bg-white border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Clock className="text-slate" size={20} />
            </div>
            <h3 className="title-section text-xl">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-sm font-bold text-ink">Criminal Search: "James Bond"</p>
              </div>
              <span className="text-xs font-medium text-slate">2 mins ago</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <p className="text-sm font-bold text-ink">Suspect Match Run</p>
              </div>
              <span className="text-xs font-medium text-slate">15 mins ago</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <p className="text-sm font-bold text-ink">Missing Alert: "Jane Doe"</p>
              </div>
              <span className="text-xs font-medium text-slate">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
