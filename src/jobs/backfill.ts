import { sql } from "bun";

type CacheEntry<T> = { value: T; expiresAt: number };
const CACHE_MAX_ENTRIES = 120;
const cache = new Map<string, CacheEntry<any>>();

function setCache<T>(key: string, value: T, ttlMs: number) {
  cache.delete(key); // refresh position if it already exists
  if (cache.size >= CACHE_MAX_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) cache.delete(oldestKey);
  }
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

function getCache<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.value as T;
}
const GENESIS_BLOCK = 1395233;
async function backfill() {
  let min_block = getCache<number>("min_block");
  if (!min_block) {
    min_block = 9999;
  }
  const query = `
  query {
	transactions(
        first: 100
		sort: HEIGHT_DESC
		tags: [
            { name: "Contract-Use", values: ["M3tering Protocol"] }
            { name: "Content-Type",  values: ["application/json"] }
            { name: "Contract-Label", values: ["M3ters"]}
              ]
	            )
        {
		pageInfo { hasNextPage }
		edges {
			cursor
			node {
				id
				owner { address }
				tags { name value }
        block { height timestamp }
			}
		}
	}
}
  `;
}
