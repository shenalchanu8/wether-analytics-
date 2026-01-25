import { ComfortRow } from "../types/weather";

export default function WeatherTable({ rows }: { rows: ComfortRow[] }) {
  // Centralized color configuration for scores
  const getScoreTheme = (score: number | null) => {
    if (score === null) return { text: "text-gray-400", bg: "bg-gray-400" };
    if (score >= 80) return { text: "text-green-600 dark:text-green-400 font-bold", bg: "bg-green-500" };
    if (score >= 60) return { text: "text-blue-600 dark:text-blue-400 font-semibold", bg: "bg-blue-500" };
    if (score >= 40) return { text: "text-amber-600 dark:text-amber-400 font-semibold", bg: "bg-yellow-500" };
    return { text: "text-red-600 dark:text-red-400 font-semibold", bg: "bg-red-500" };
  };

  const getRankBadge = (rank: number | null) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank ?? "-";
  };

  const getRankBgColor = (rank: number | null) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/10";
    if (rank === 2) return "bg-gradient-to-r from-slate-50 to-gray-100 dark:from-slate-800/40 dark:to-gray-800/20";
    if (rank === 3) return "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10";
    return "bg-white dark:bg-slate-900";
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-purple-50 to-white dark:from-slate-800 dark:to-slate-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">🌍 City Rankings</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Ranked from most comfortable → least comfortable
        </p>
      </div>

      <div className="p-4">
        {rows.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500 dark:text-gray-400">No data available for these cities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rows.map((r) => {
              const theme = getScoreTheme(r.comfortScore);
              return (
                <div
                  key={r.city.id}
                  className={`border dark:border-slate-700 rounded-lg p-4 transition-all hover:shadow-md ${getRankBgColor(r.rank)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border dark:border-slate-600 flex items-center justify-center font-bold text-gray-900 dark:text-white shadow-sm">
                        {getRankBadge(r.rank)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                          {r.city.name}
                        </h4>
                        {r.cache?.raw && (
                           <span className={`inline-block px-2 py-0.5 mt-1 rounded-full text-[10px] font-bold uppercase ${
                            r.cache.raw === 'HIT' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                           }`}>
                            {r.cache.raw}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {r.weather.tempC !== null ? `${r.weather.tempC}°` : "-"}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Temp</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize italic">
                      {r.weather.description || "Clear skies"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">
                        Comfort Score
                      </div>
                      <div className={`text-xl ${theme.text}`}>
                        {r.comfortScore ?? "-"}
                      </div>
                    </div>
                    
                    <div className="w-24">
                      <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${theme.bg}`}
                          style={{ width: `${Math.min(100, r.comfortScore || 0)}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 text-right font-mono">
                        /100
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}