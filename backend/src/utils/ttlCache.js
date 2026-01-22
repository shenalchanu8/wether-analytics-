import { create } from "domain";

// create a Time to live class
export class TTLCashe {
    constructor (ttlms) {
        this.ttlms = ttlms;
        this.map = new Map();
        this.hits = 0;
        this.misses = 0;
    }

    set (key, value, ttlMs = this.ttlms) {
        const now = Date.now(); 
        this.map.set (key, { value, createdAt: now, ttlMs });
    }

    get (key) {
        const entry = this.map.get (key);
        const now = Date.now();

        // first check cities weather saved and not expired
        if(!entry) {
            this.misses++;
            return {hit : false, value : null ,ttlRemainingMs : 0}; 
        }

        if (entry.expirestAt <= now) {
            this.map.delete (key);
            this.misses++;
            return {hit : false, value : null ,ttlRemainingMs : 0};
        }

    this.hits++;
    return {hit : true, value : entry.value , ttlRemainingMs : entry.expirestAt - now};
    }


debugSnapshot() {
    const now = Date.now();
    const entries = [];
    for (const [key, entry] of this.map.entries()) {
        entries.push ({
            key,
            ttlRemainingMs : Math.max (0, entry.expirestAt - now),
        });
    }
    return { size: this.map.size, hits: this.hits, misses: this.misses, entries };
    }
}