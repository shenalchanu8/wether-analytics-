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

  const avgScore = useMemo(() => {
    const nums = rows.map(r => r.comfortScore).filter((x): x is number => typeof x === "number");
    if (nums.length === 0) return "-";
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    return avg.toFixed(1);
  }, [rows]);

  const bestCity = useMemo(() => rows.find(r => r.rank === 1)?.city.name || "-", [rows]);

  const fetchComfort = async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();

      const resp = await api.get<ComfortResponse>(`/api/comfort${refresh ? "?refresh=true" : ""}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRows(resp.data.result);
      setProcessedCache(resp.data.cache.processed);
      setTtl(resp.data.cache.ttlRemainingMs);
    } catch (e: any) {
      console.error("API Error:", e);
      const errorMsg = e?.response?.data?.message || e.message || "Request failed";
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <TopBar onRefresh={() => fetchComfort(true)} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Processed Cache" value={processedCache} />
          <StatCard label="TTL Remaining (ms)" value={ttl !== undefined ? String(ttl) : "-"} />
          <StatCard label="Top City" value={bestCity} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Avg Comfort Score" value={String(avgScore)} />
          <StatCard label="Cities" value={String(rows.length)} />
          <StatCard label="Tip" value="Refresh to bypass cache" />
        </div>

        {loading && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">Loading comfort data...</p>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-xl p-6 border border-red-200">
            <p className="text-red-600 font-semibold">⚠️ Error</p>
            <p className="text-gray-700 mt-1">{error}</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700">Common fixes:</p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
                <li>Check if backend is running on http://localhost:5000</li>
                <li>Verify Auth0 ISSUER and AUDIENCE in both .env files</li>
                <li>Ensure CORS_ORIGIN in backend matches frontend URL</li>
                <li>Check browser console for detailed errors</li>
              </ul>
            </div>
            <button
              onClick={() => fetchComfort(false)}
              className="mt-4 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && <WeatherTable rows={rows} />}
      </div>
    </div>
  );
}