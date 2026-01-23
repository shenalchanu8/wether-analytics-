import { Router } from "express";
import { requireAuth } from "../middleware/auth0.js";
import { loadCities } from "../services/city.service.js";
import { fetchWeather, rawCache } from "../services/openWeather.service.js";
import { computeComfortIndex } from "../services/comfort.service.js";
import { TTLCache } from "../utils/ttlCache.js";
import { env } from "../config/env.js";
import { asyncPool } from "../utils/asyncPool.js";

const router = Router();
const processedCache = new TTLCache(env.CACHE_TTL_MS);

router.get("/health", (req, res) => res.json({ ok: true }));

router.get("/comfort", requireAuth, async (req, res, next) => {
  try {
    const refresh = String(req.query.refresh || "") === "true";
    const cities = loadCities();

    const key = "processed:all";
    if (!refresh) {
      const cached = processedCache.get(key);
      if (cached.hit) {
        return res.json({
          cache: { processed: "HIT", ttlRemainingMs: cached.ttlRemainingMs },
          result: cached.value
        });
      }
    }

    const rows = await asyncPool(4, cities, async (c) => {
      const w = await fetchWeather(c.CityCode, { refresh });
      const { score } = computeComfortIndex(w.data);

      return {
        city: { id: c.CityCode, name: w.data?.name || c.CityName },
        weather: {
          description: w.data?.weather?.[0]?.description || "",
          tempC: w.data?.main?.temp ?? null
        },
        comfortScore: score,
        rank: null,
        cache: { raw: w.cache }
      };
    });

    const valid = rows.filter((r) => typeof r.comfortScore === "number");
    valid.sort((a, b) => b.comfortScore - a.comfortScore);
    valid.forEach((r, i) => (r.rank = i + 1));

    rows.sort((a, b) => {
      if (a.rank && b.rank) return a.rank - b.rank;
      if (a.rank) return -1;
      if (b.rank) return 1;
      return a.city.name.localeCompare(b.city.name);
    });

    processedCache.set(key, rows);

    res.json({
      cache: { processed: "MISS", ttlRemainingMs: env.CACHE_TTL_MS },
      result: rows
    });
  } catch (e) {
    next(e);
  }
});

router.get("/debug/cache", requireAuth, (req, res) => {
  res.json({
    rawCache: rawCache.debugSnapshot(),
    processedCache: processedCache.debugSnapshot()
  });
});

export default router;
