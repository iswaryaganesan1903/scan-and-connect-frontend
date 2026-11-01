// Shows a message. type = "error" | "success" | "warning"
const STYLES = {
  error: "bg-red-50 text-red-800 ring-red-200",
  success: "bg-mint-100 text-forest-800 ring-mint-200",
  warning: "bg-amber-50 text-amber-900 ring-amber-200",
};

export default function Alert({ type = "error", children }) {
  if (!children) return null;
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`mt-4 rounded-xl px-4 py-3 text-sm ring-1 ${STYLES[type]}`}
    >
      {children}
    </div>
  );
}
