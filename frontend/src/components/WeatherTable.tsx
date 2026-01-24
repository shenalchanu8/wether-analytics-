import { ComfortRow } from "../types/weather";

export default function WeatherTable({ rows }: { rows: ComfortRow[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">City Rankings</h3>
        <p className="text-sm text-gray-600">Most comfortable → least comfortable</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">Rank</th>
              <th className="text-left px-4 py-3">City</th>
              <th className="text-left px-4 py-3">Weather</th>
              <th className="text-left px-4 py-3">Temp (°C)</th>
              <th className="text-left px-4 py-3">Comfort Score</th>
              <th className="text-left px-4 py-3">Raw Cache</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.city.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-semibold">{r.rank ?? "-"}</td>
                <td className="px-4 py-3">{r.city.name}</td>
                <td className="px-4 py-3 capitalize">{r.weather.description}</td>
                <td className="px-4 py-3">{r.weather.tempC ?? "-"}</td>
                <td className="px-4 py-3 font-semibold">
                  {typeof r.comfortScore === "number" ? r.comfortScore : "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      r.cache?.raw === "HIT"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {r.cache?.raw || "-"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
