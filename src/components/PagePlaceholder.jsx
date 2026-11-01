import { Link } from "react-router-dom";

export default function PagePlaceholder({ title, phase, backTo, backLabel }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      {phase && (
        <span className="rounded-full bg-champagne-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink-700">
          Built in Phase {phase}
        </span>
      )}
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink-900">
        {title}
      </h1>
      <p className="mt-2 text-slate-600">
        This route is connected to the router and works. The real page is added
        in a later phase.
      </p>
      {backTo && (
        <Link
          to={backTo}
          className="mt-6 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-ivory transition hover:bg-ink-800"
        >
          {backLabel}
        </Link>
      )}
    </div>
  );
}