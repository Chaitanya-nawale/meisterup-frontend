import { neon } from "@neondatabase/serverless";
const databaseUrl = process.env.DATABASE_URL || "postgres://username:password@hostname/dbname";
const sql = neon(databaseUrl);

async function test() {
  try {
    const res = await sql`SELECT 1 as num`;
    console.log("Success with regular array:", res);
  } catch (e) {
    console.log("Error with regular array:", e instanceof Error ? e.message : String(e));
  }
}
test();
