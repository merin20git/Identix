export default function Spinner({ size = "md", color = "primary" }) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  };

  const colorClasses = {
    primary: "border-primary/20 border-t-primary",
    white: "border-white/20 border-t-white",
    action: "border-action/20 border-t-action"
  };

  return (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`} />
  );
}
