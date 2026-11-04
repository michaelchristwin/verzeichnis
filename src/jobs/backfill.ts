import { pg } from "../db";

const ARWEAVE_GATEWAY = "https://arweave.net";

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
  if (min_block === undefined) {
    const [row] =
      await pg`SELECT block_height FROM data_points ORDER BY block_height LIMIT 1`;
    min_block = row;
    if (min_block === undefined) min_block = GENESIS_BLOCK;
  }
  setCache("min_block", min_block, 1000 * 60 * 60 * 24);
  let cursor: string | undefined;
  const chainStatusResponse = await fetch(ARWEAVE_GATEWAY);
  if (!chainStatusResponse.ok) {
    throw new Error(`HTTP error! status: ${chainStatusResponse.status}`);
  }
  const chainStatus = await chainStatusResponse.json();
  //@ts-ignore
  const max_block = chainStatus.height as number;
  const query = `
    query {
  	transactions(
          first: 100
  		    sort: HEIGHT_DESC
          ${cursor !== undefined && `after: ${cursor}`}
          block: { min: ${min_block}, max: ${max_block} }
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
  const response = await fetch(`${ARWEAVE_GATEWAY}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
}

await backfill();
