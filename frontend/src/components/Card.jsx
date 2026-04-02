export default function Card({ title, children, action, icon: Icon }) {
  return (
    <div className="card">
      {(title || Icon) && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Icon size={20} />
              </div>
            )}
            <h3 className="title-section">{title}</h3>
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
