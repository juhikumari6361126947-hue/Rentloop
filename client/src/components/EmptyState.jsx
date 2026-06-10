export default function EmptyState({ title, message }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{message}</p>
    </div>
  );
}
