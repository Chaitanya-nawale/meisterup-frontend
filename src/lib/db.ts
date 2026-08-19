import { neon } from "@neondatabase/serverless";

// The Neon database connection URL
const databaseUrl = import.meta.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL is not set. Database queries will fail.");
}

// Export the neon SQL tagged template literal for making queries
export const sql = neon(databaseUrl as string);
