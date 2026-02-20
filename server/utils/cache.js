// Simple in-memory cache for API responses
class SimpleCache {
    constructor() {
        this.cache = new Map();
    }

    set(key, value, ttlSeconds = 60) {
        const expiresAt = Date.now() + (ttlSeconds * 1000);
        this.cache.set(key, { value, expiresAt });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    clear() {
        this.cache.clear();
    }

    deletePattern(pattern) {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }

    // Clean up expired entries periodically
    startCleanup(intervalSeconds = 300) {
        setInterval(() => {
            const now = Date.now();
            for (const [key, item] of this.cache.entries()) {
                if (now > item.expiresAt) {
                    this.cache.delete(key);
                }
            }
        }, intervalSeconds * 1000);
    }
}

const cache = new SimpleCache();
cache.startCleanup(300); // Clean up every 5 minutes

export default cache;
