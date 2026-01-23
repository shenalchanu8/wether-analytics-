import axios from "axios";
import { env } from "../config/env.js";
import { TTLCache } from "../utils/ttlCache.js";;

export const rawCache = new TTLCache(env.CACHE_TTL_MS);

const client = axios.create({
    baseURL: "https://api.openweathermap.org/data/2.5/",
    timeout: 5000,
    }) ;

export async function fetchWeather (cityId ,{ refresh = false} = {}) {
    const key = `raw:${cityId}`;
    if (!refresh) {
    const cached = rawCache.get(key);
    if (cached.hit) {
      return { data: cached.value, cache: "HIT", ttlRemainingMs: cached.ttlRemainingMs };
    }
  }

    const response = await client.get("/weather", {
        params: {
            id: cityId,
            appid: env.OPENWEATHER_API_KEY,
            units: "metric",
        },
    });

    rawCache.set(key, response.data);
    return { data: response.data, cache: "MISS", ttlRemainingMs: env.CACHE_TTL_MS };
}
