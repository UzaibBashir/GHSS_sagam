import {
  ADMIN_BUTTON,
  ADMIN_SECTION,
  ADMIN_SECTION_DESC,
  ADMIN_SECTION_TITLE,
  ADMIN_SUBCARD,
} from "./adminStyles";

function MetricCard({ label, value }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
    </article>
  );
}

function SimpleTable({ title, columns, rows }) {
  return (
    <article className={ADMIN_SUBCARD}>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {rows.length ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-160 text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-3 py-2">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${title}-${index}`} className="border-t border-slate-200">
                  {row.map((cell, cellIndex) => (
                    <td key={`${title}-${index}-${cellIndex}`} className="px-3 py-2 text-slate-700">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">No data collected yet.</p>
      )}
    </article>
  );
}

export default function MonitoringManager({ monitoring, onRefresh, loading }) {
  const api = monitoring?.api || { count: 0, p50: 0, p95: 0, latest: [] };
  const webVitals = monitoring?.webVitals || { count: 0, latest: [] };

  return (
    <section className={ADMIN_SECTION} id="monitoring">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={ADMIN_SECTION_TITLE}>Performance Monitoring</h2>
          <p className={ADMIN_SECTION_DESC}>Track Core Web Vitals and API latency trends from real traffic.</p>
        </div>
        <button type="button" className={ADMIN_BUTTON} onClick={onRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh metrics"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <MetricCard label="API samples" value={api.count || 0} />
        <MetricCard label="API p50 (ms)" value={api.p50 || 0} />
        <MetricCard label="API p95 (ms)" value={api.p95 || 0} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <SimpleTable
          title="Latest API latency"
          columns={["When", "Route", "Method", "Status", "Duration (ms)"]}
          rows={(api.latest || []).map((item) => [
            new Date(item.at).toLocaleString(),
            item.route || "-",
            item.method || "GET",
            item.status || 0,
            Number(item.durationMs || 0).toFixed(1),
          ])}
        />
        <SimpleTable
          title={`Latest Web Vitals (${webVitals.count || 0})`}
          columns={["When", "Page", "Metric", "Value", "Rating"]}
          rows={(webVitals.latest || []).map((item) => [
            new Date(item.at).toLocaleString(),
            item.page || "-",
            item.name || "-",
            Number(item.value || 0).toFixed(2),
            item.rating || "-",
          ])}
        />
      </div>
    </section>
  );
}
