export class TTLCache {
  constructor(defaultTtlMs) {
    this.defaultTtlMs = defaultTtlMs;
    this.map = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  set(key, value, ttlMs = this.defaultTtlMs) {
    const now = Date.now();
    this.map.set(key, { value, createdAt: now, expiresAt: now + ttlMs });
  }

  get(key) {
    const entry = this.map.get(key);
    const now = Date.now();

    if (!entry) {
      this.misses++;
      return { hit: false, value: null, ttlRemainingMs: 0 };
    }

    if (entry.expiresAt <= now) {
      this.map.delete(key);
      this.misses++;
      return { hit: false, value: null, ttlRemainingMs: 0 };
    }

    this.hits++;
    return { hit: true, value: entry.value, ttlRemainingMs: entry.expiresAt - now };
  }

  debugSnapshot() {
    const now = Date.now();
    const items = [];
    for (const [key, entry] of this.map.entries()) {
      items.push({
        key,
        ttlRemainingMs: Math.max(0, entry.expiresAt - now),
        createdAt: entry.createdAt
      });
    }
    return { size: this.map.size, hits: this.hits, misses: this.misses, items };
  }
}
