import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { apiRequest } from "../services/api";
import { 
  Users, 
  ShieldAlert, 
  Cctv, 
  UserCheck,
  TrendingUp,
  Activity
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

const data = [
  { name: "00:00", detections: 40 },
  { name: "04:00", detections: 30 },
  { name: "08:00", detections: 65 },
  { name: "12:00", detections: 90 },
  { name: "16:00", detections: 70 },
  { name: "20:00", detections: 50 },
  { name: "23:59", detections: 45 },
];

const matchData = [
  { name: "Criminals", value: 12, color: "#2563eb" },
  { name: "Missing", value: 5, color: "#f59e0b" },
  { name: "Suspicious", value: 8, color: "#ef4444" },
];

function StatCard({ title, value, subtitle, icon: Icon, colorClass }) {
  return (
    <div className="card hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorClass}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-1 text-green-500 font-bold text-sm">
          <TrendingUp size={16} />
          +12%
        </div>
      </div>
      <h3 className="label mb-1">{title}</h3>
      <p className="text-4xl font-extrabold text-ink mb-2">{value}</p>
      <p className="text-sm font-medium text-slate">{subtitle}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ criminals: 0, missing: 0, officers: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [criminals, missing, officers] = await Promise.all([
          apiRequest("/admin/criminals"),
          apiRequest("/admin/missing"),
          apiRequest("/admin/officers")
        ]);
        setStats({ 
          criminals: criminals.length, 
          missing: missing.length,
          officers: officers.length 
        });
      } catch (err) {
        setError(err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Spinner />
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="title-main mb-2">System Overview</h2>
          <p className="text-xl text-slate font-medium">Real-time surveillance monitoring and database statistics.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-ghost">Export Report</button>
          <button className="btn-primary">System Refresh</button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-alert rounded-2xl border border-red-100 font-bold">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Criminals" 
          value={stats.criminals} 
          subtitle="Registered suspects"
          icon={Users}
          colorClass="bg-primary"
        />
        <StatCard 
          title="Missing Persons" 
          value={stats.missing} 
          subtitle="Active search cases"
          icon={ShieldAlert}
          colorClass="bg-action"
        />
        <StatCard 
          title="Active CCTV Alerts" 
          value="24" 
          subtitle="Detected today"
          icon={Cctv}
          colorClass="bg-alert"
        />
        <StatCard 
          title="Registered Officers" 
          value={stats.officers} 
          subtitle="Active personnel"
          icon={UserCheck}
          colorClass="bg-ink"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Activity size={20} />
            </div>
            <h3 className="title-section">Detection Activity</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="detections" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorDetections)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-action/10 rounded-lg text-action">
              <TrendingUp size={20} />
            </div>
            <h3 className="title-section">Matches Detected Today</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matchData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {matchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
