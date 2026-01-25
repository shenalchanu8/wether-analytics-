import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import TopBar from "../components/TopBar";
import WeatherTable from "../components/WeatherTable";
import StatCard from "../components/StatCard";
import { ComfortResponse, ComfortRow } from "../types/weather";

export default function Dashboard() {
  const { getToken } = useAuth();

  const [rows, setRows] = useState<ComfortRow[]>([]);
  const [processedCache, setProcessedCache] = useState<"HIT" | "MISS">("MISS");
  const [ttl, setTtl] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Filtering and sorting state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"rank" | "temp" | "score" | "name">("rank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Chart view toggle
  const [showChart, setShowChart] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  // Apply dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Filter and sort rows
  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows.filter((row) =>
      row.city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case "rank":
          compareValue = (a.rank || 999) - (b.rank || 999);
          break;
        case "temp":
          compareValue = (a.weather.tempC || 0) - (b.weather.tempC || 0);
          break;
        case "score":
          compareValue = (a.comfortScore || 0) - (b.comfortScore || 0);
          break;
        case "name":
          compareValue = a.city.name.localeCompare(b.city.name);
          break;
      }

      return sortOrder === "asc" ? compareValue : -compareValue;
    });

    return filtered;
  }, [rows, searchTerm, sortBy, sortOrder]);

  // Calculate statistics
  const avgScore = useMemo(() => {
    const nums = rows
      .map((r) => r.comfortScore)
      .filter((x): x is number => typeof x === "number");

    if (nums.length === 0) return "-";

    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    return avg.toFixed(1);
  }, [rows]);

  const bestCity = useMemo(() => {
    const top = rows.find((r) => r.rank === 1);
    return top?.city.name || "-";
  }, [rows]);

  const avgTemp = useMemo(() => {
    const temps = rows
      .map((r) => r.weather.tempC)
      .filter((x): x is number => typeof x === "number");

    if (temps.length === 0) return "-";

    const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
    return `${avg.toFixed(1)}°C`;
  }, [rows]);

  // Fetch comfort data from backend
  const fetchComfort = async (refresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();

      const resp = await api.get<ComfortResponse>(
        `/api/comfort${refresh ? "?refresh=true" : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRows(resp.data.result);
      setProcessedCache(resp.data.cache.processed);
      setTtl(resp.data.cache.ttlRemainingMs);
    } catch (e: any) {
      console.error("❌ API Error:", e);

      const errorMsg =
        e?.response?.data?.message || e?.message || "Failed to fetch weather data";

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComfort(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Bar with integrated buttons */}
          <TopBar 
            onRefresh={() => fetchComfort(true)}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            showChart={showChart}
            onToggleChart={() => setShowChart(!showChart)}
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Cache Status" value={processedCache} />
            <StatCard
              label="TTL Remaining"
              value={ttl !== undefined ? `${(ttl / 1000).toFixed(0)}s` : "-"}
            />
            <StatCard label="Top City" value={bestCity} />
            <StatCard label="Avg Temperature" value={avgTemp} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Avg Comfort Score" value={avgScore} />
            <StatCard label="Total Cities" value={String(rows.length)} />
            <StatCard label="Filtered Results" value={String(filteredAndSortedRows.length)} />
            <StatCard
              label="Mode"
              value={darkMode ? "🌙 Dark" : "☀️ Light"}
            />
          </div>

          {/* Search and Filter Controls */}
          {!loading && !error && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                🔍 Search & Filter
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search City
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter city name..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="rank">Rank</option>
                    <option value="name">City Name</option>
                    <option value="temp">Temperature</option>
                    <option value="score">Comfort Score</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="asc">Ascending ↑</option>
                    <option value="desc">Descending ↓</option>
                  </select>
                </div>
              </div>

              {searchTerm && (
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredAndSortedRows.length} of {rows.length} cities
                  {filteredAndSortedRows.length === 0 && (
                    <span className="ml-2 text-red-600 dark:text-red-400 font-medium">
                      - No matches found
                    </span>
                  )}
                </p>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Loading Weather Data...
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Fetching comfort analysis for all cities
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-red-300 dark:border-red-700 shadow-lg transition-colors duration-300">
              <div className="flex items-start gap-3">
                <span className="text-3xl">⚠️</span>
                <div className="flex-1">
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">
                    Error Loading Data
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">{error}</p>

                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                      🔧 Troubleshooting Steps:
                    </p>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">1.</span>
                        <span>
                          Verify backend is running on{" "}
                          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300 font-mono text-xs">
                            http://localhost:5000
                          </code>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">2.</span>
                        <span>Check Auth0 configuration in .env files</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">3.</span>
                        <span>Check browser console for detailed errors</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => fetchComfort(false)}
                    className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md"
                  >
                    🔄 Retry Request
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chart View */}
          {!loading && !error && showChart && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  📊 Weather Analytics Visualization
                </h3>
                
                {/* Chart Type Selector */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartType("bar")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      chartType === "bar"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    📊 Bar Chart
                  </button>
                  <button
                    onClick={() => setChartType("line")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      chartType === "line"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    📈 Line Chart
                  </button>
                </div>
              </div>

              {chartType === "bar" ? (
                // Bar Chart
                <div className="space-y-6">
                  {/* Temperature Bar Chart */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      🌡️ Temperature Comparison
                    </h4>
                    <div className="space-y-3">
                      {filteredAndSortedRows.map((row) => {
                        const temp = row.weather.tempC || 0;
                        const maxTemp = Math.max(...filteredAndSortedRows.map(r => r.weather.tempC || 0));
                        const minTemp = Math.min(...filteredAndSortedRows.map(r => r.weather.tempC || 0));
                        const range = maxTemp - minTemp || 1;
                        const widthPercent = ((temp - minTemp) / range) * 100;

                        return (
                          <div key={`temp-${row.city.id}`} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-700 dark:text-gray-300 w-32 truncate">
                                {row.city.name}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400 text-xs">
                                {temp.toFixed(1)}°C
                              </span>
                            </div>
                            <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                              <div
                                className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-red-600 transition-all duration-700 ease-out flex items-center justify-end pr-3"
                                style={{ width: `${Math.max(widthPercent, 5)}%` }}
                              >
                                {widthPercent > 15 && (
                                  <span className="text-white text-xs font-bold">
                                    {temp.toFixed(1)}°C
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comfort Score Bar Chart */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      ⭐ Comfort Score Comparison
                    </h4>
                    <div className="space-y-3">
                      {filteredAndSortedRows.map((row) => {
                        const score = row.comfortScore || 0;
                        const widthPercent = score;

                        return (
                          <div key={`score-${row.city.id}`} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-700 dark:text-gray-300 w-32 truncate">
                                {row.city.name}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400 text-xs">
                                Score: {score}
                              </span>
                            </div>
                            <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                              <div
                                className={`h-full transition-all duration-700 ease-out flex items-center justify-end pr-3 ${
                                  score >= 80
                                    ? "bg-gradient-to-r from-green-400 to-green-600"
                                    : score >= 60
                                    ? "bg-gradient-to-r from-blue-400 to-blue-600"
                                    : score >= 40
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                    : "bg-gradient-to-r from-red-400 to-red-600"
                                }`}
                                style={{ width: `${Math.max(widthPercent, 5)}%` }}
                              >
                                {widthPercent > 15 && (
                                  <span className="text-white text-xs font-bold">{score}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                // Line Chart
                <div className="space-y-6">
                  {/* Temperature Line Chart */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      🌡️ Temperature Trend
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                      <svg viewBox="0 0 800 300" className="w-full h-64">
                        {/* Grid Lines */}
                        {[0, 25, 50, 75, 100].map((y) => (
                          <line
                            key={`grid-${y}`}
                            x1="50"
                            y1={250 - (y * 2)}
                            x2="780"
                            y2={250 - (y * 2)}
                            stroke="currentColor"
                            className="text-gray-300 dark:text-gray-700"
                            strokeWidth="1"
                            strokeDasharray="5,5"
                          />
                        ))}

                        {/* Temperature Line */}
                        <polyline
                          points={filteredAndSortedRows
                            .map((row, i) => {
                              const x = 50 + (i * (730 / (filteredAndSortedRows.length - 1 || 1)));
                              const temp = row.weather.tempC || 0;
                              const maxTemp = Math.max(...filteredAndSortedRows.map(r => r.weather.tempC || 0));
                              const minTemp = Math.min(...filteredAndSortedRows.map(r => r.weather.tempC || 0));
                              const range = maxTemp - minTemp || 1;
                              const y = 250 - ((temp - minTemp) / range) * 200;
                              return `${x},${y}`;
                            })
                            .join(" ")}
                          fill="none"
                          stroke="url(#tempGradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data Points */}
                        {filteredAndSortedRows.map((row, i) => {
                          const x = 50 + (i * (730 / (filteredAndSortedRows.length - 1 || 1)));
                          const temp = row.weather.tempC || 0;
                          const maxTemp = Math.max(...filteredAndSortedRows.map(r => r.weather.tempC || 0));
                          const minTemp = Math.min(...filteredAndSortedRows.map(r => r.weather.tempC || 0));
                          const range = maxTemp - minTemp || 1;
                          const y = 250 - ((temp - minTemp) / range) * 200;

                          return (
                            <g key={`point-temp-${row.city.id}`}>
                              <circle
                                cx={x}
                                cy={y}
                                r="5"
                                fill="#f97316"
                                stroke="white"
                                strokeWidth="2"
                              />
                              <text
                                x={x}
                                y={y - 15}
                                textAnchor="middle"
                                className="text-xs font-bold fill-gray-700 dark:fill-gray-300"
                              >
                                {temp.toFixed(1)}°
                              </text>
                            </g>
                          );
                        })}

                        {/* X-axis Labels */}
                        {filteredAndSortedRows.map((row, i) => {
                          const x = 50 + (i * (730 / (filteredAndSortedRows.length - 1 || 1)));
                          return (
                            <text
                              key={`label-temp-${row.city.id}`}
                              x={x}
                              y="280"
                              textAnchor="middle"
                              className="text-xs fill-gray-600 dark:fill-gray-400"
                            >
                              {row.city.name.substring(0, 8)}
                            </text>
                          );
                        })}

                        {/* Gradient Definition */}
                        <defs>
                          <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="50%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#dc2626" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  {/* Comfort Score Line Chart */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      ⭐ Comfort Score Trend
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                      <svg viewBox="0 0 800 300" className="w-full h-64">
                        {/* Grid Lines */}
                        {[0, 25, 50, 75, 100].map((y) => (
                          <line
                            key={`grid-score-${y}`}
                            x1="50"
                            y1={250 - (y * 2)}
                            x2="780"
                            y2={250 - (y * 2)}
                            stroke="currentColor"
                            className="text-gray-300 dark:text-gray-700"
                            strokeWidth="1"
                            strokeDasharray="5,5"
                          />
                        ))}

                        {/* Y-axis Labels */}
                        {[0, 25, 50, 75, 100].map((y) => (
                          <text
                            key={`ylabel-${y}`}
                            x="35"
                            y={255 - (y * 2)}
                            textAnchor="end"
                            className="text-xs fill-gray-600 dark:fill-gray-400"
                          >
                            {y}
                          </text>
                        ))}

                        {/* Comfort Score Line */}
                        <polyline
                          points={filteredAndSortedRows
                            .map((row, i) => {
                              const x = 50 + (i * (730 / (filteredAndSortedRows.length - 1 || 1)));
                              const score = row.comfortScore || 0;
                              const y = 250 - (score * 2);
                              return `${x},${y}`;
                            })
                            .join(" ")}
                          fill="none"
                          stroke="url(#scoreGradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data Points */}
                        {filteredAndSortedRows.map((row, i) => {
                          const x = 50 + (i * (730 / (filteredAndSortedRows.length - 1 || 1)));
                          const score = row.comfortScore || 0;
                          const y = 250 - (score * 2);

                          return (
                            <g key={`point-score-${row.city.id}`}>
                              <circle
                                cx={x}
                                cy={y}
                                r="5"
                                fill={
                                  score >= 80
                                    ? "#22c55e"
                                    : score >= 60
                                    ? "#3b82f6"
                                    : score >= 40
                                    ? "#eab308"
                                    : "#ef4444"
                                }
                                stroke="white"
                                strokeWidth="2"
                              />
                              <text
                                x={x}
                                y={y - 15}
                                textAnchor="middle"
                                className="text-xs font-bold fill-gray-700 dark:fill-gray-300"
                              >
                                {score}
                              </text>
                            </g>
                          );
                        })}

                        {/* X-axis Labels */}
                        {filteredAndSortedRows.map((row, i) => {
                          const x = 50 + (i * (730 / (filteredAndSortedRows.length - 1 || 1)));
                          return (
                            <text
                              key={`label-score-${row.city.id}`}
                              x={x}
                              y="280"
                              textAnchor="middle"
                              className="text-xs fill-gray-600 dark:fill-gray-400"
                            >
                              {row.city.name.substring(0, 8)}
                            </text>
                          );
                        })}

                        {/* Gradient Definition */}
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-red-600 rounded"></div>
                    <span>Temperature (°C)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded"></div>
                    <span>Comfort Score (0-100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Excellent (80+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Good (60-79)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Fair (40-59)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Poor (&lt;40)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Table View */}
          {!loading && !error && !showChart && (
            <WeatherTable rows={filteredAndSortedRows} />
          )}
        </div>
      </div>
    </div>
  );
}