import { NavLink } from "react-router-dom";

export default function Sidebar({ items }) {
  return (
    <aside className="w-full md:w-80 bg-white border-r border-gray-100 min-h-[calc(100vh-88px)] p-6 flex flex-col gap-2">
      <div className="mb-4">
        <p className="px-4 text-xs font-bold text-slate uppercase tracking-widest">Main Menu</p>
      </div>
      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return item.onClick ? (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex items-center gap-4 w-full text-left rounded-xl px-4 py-4 text-lg font-semibold text-slate hover:bg-red-50 hover:text-alert transition-all group"
            >
              <div className="p-1 rounded-lg bg-gray-50 group-hover:bg-red-100 transition-colors">
                {Icon && <Icon size={24} />}
              </div>
              {item.label}
            </button>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-4 text-lg font-semibold transition-all group ${
                  isActive 
                  ? "bg-primary/5 text-primary" 
                  : "text-slate hover:bg-gray-50"
                }`
              }
            >
              <div className={`p-1 rounded-lg transition-colors ${
                "group-hover:bg-white"
              }`}>
                {Icon && <Icon size={24} />}
              </div>
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="mt-auto p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
        <p className="text-sm font-bold text-primary mb-1">IDENTIX v2.0</p>
        <p className="text-xs text-slate font-medium">Enterprise Security Ready</p>
      </div>
    </aside>
  );
}
