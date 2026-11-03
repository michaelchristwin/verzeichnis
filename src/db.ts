import { SQL } from "bun";

if (!process.env.DATABASE_URL) throw Error("Database URL is undefined");

export const pg = new SQL(process.env.DATABASE_URL);
