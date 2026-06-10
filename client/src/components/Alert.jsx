export default function Alert({ type = "error", children }) {
  const tone =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-800";

  return <div className={`rounded-md border px-3 py-2 text-sm ${tone}`}>{children}</div>;
}
