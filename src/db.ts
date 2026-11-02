import { SQL } from "bun";

if (!process.env.DB_URL) throw Error("Database URL is undefined");

export const pg = new SQL(process.env.DB_URL);
