import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

// Fix sslmode for Supabase PgBouncer self-signed cert
const dbUrl = process.env.DATABASE_URL.replace(/[?&]sslmode=[^&]*/g, (match: string) =>
  match.startsWith('?') ? '?' : ''
).replace(/\?$/, '');

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
