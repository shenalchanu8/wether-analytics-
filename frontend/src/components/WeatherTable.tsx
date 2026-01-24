import { ComfortRow } from "../types/weather";

export default function WeatherTable({ rows }: { rows: ComfortRow[] }) {
  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-400";
    if (score >= 80) return "text-green-600 font-bold";
    if (score >= 60) return "text-blue-600 font-semibold";
    if (score >= 40) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  const getRankBadge = (rank: number | null) => {
    if (rank === null) return null;
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const getRankBgColor = (rank: number | null) => {
    if (rank === null) return "bg-gray-100";
    if (rank === 1) return "bg-gradient-to-r from-yellow-100 to-amber-100";
    if (rank === 2) return "bg-gradient-to-r from-gray-100 to-slate-200";
    if (rank === 3) return "bg-gradient-to-r from-amber-50 to-orange-50";
    return "bg-gray-50";
  };

  const getCacheBadge = (cacheStatus: string | null | undefined) => {
    if (cacheStatus === "HIT") {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
          HIT
        </span>
      );
    } else if (cacheStatus === "MISS") {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase">
          MISS
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
        <h3 className="text-lg font-bold text-gray-900">🌍 City Rankings</h3>
        <p className="text-sm text-gray-600 mt-1">
          Ranked from most comfortable → least comfortable
        </p>
      </div>

      <div className="p-4">
        {rows.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">📊</div>
            <p className="text-gray-500">No data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rows.map((r) => (
              <div
                key={r.city.id}
                className={`border rounded-lg p-4 transition-all hover:shadow-md ${getRankBgColor(
                  r.rank
                )}`}
              >
               
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center font-bold text-gray-900 shadow-sm">
                      {getRankBadge(r.rank) ?? "-"}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {r.city.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {getCacheBadge(r.cache?.raw)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {r.weather.tempC !== null ? `${r.weather.tempC}°` : "-"}
                    </div>
                    <div className="text-xs text-gray-500">Temperature</div>
                  </div>
                </div>

             
                <div className="mb-3">
                  <div className="text-sm text-gray-600 capitalize">
                    {r.weather.description || "-"}
                  </div>
                </div>

              
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Comfort Score
                    </div>
                    <div className={`text-lg ${getScoreColor(r.comfortScore)}`}>
                      {typeof r.comfortScore === "number"
                        ? r.comfortScore
                        : "-"}
                    </div>
                  </div>
                  
                 
                  <div className="w-24">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          r.comfortScore && r.comfortScore >= 80
                            ? "bg-green-500"
                            : r.comfortScore && r.comfortScore >= 60
                            ? "bg-blue-500"
                            : r.comfortScore && r.comfortScore >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            r.comfortScore || 0
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 text-right">
                      /100
                    </div>
                  </div>
                </div>

               
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Rank #{r.rank ?? "-"}</span>
                    <span>ID: {r.city.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}