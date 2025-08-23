import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  driver: "postgres-js",
  tablesFilter: ["!mastra*"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
