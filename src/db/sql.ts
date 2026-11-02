import { SQL } from "bun";

if (!process.env.DB_URL) throw Error("Database URL is undefined");

const pg = new SQL(process.env.DB_URL);

const results =
  await pg`SELECT DISTINCT rental_rate FROM film ORDER BY rental_rate`;
console.log(results);
