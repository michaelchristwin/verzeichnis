await Bun.cron("../jobs/indexer.ts", "*/15 * * * *", "index-m3ters");
