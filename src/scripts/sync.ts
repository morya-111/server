// One-off setup against the configured database + Supabase project:
// creates/updates tables and ensures the public image bucket exists.
// Usage: yarn db:sync
import "reflect-metadata";
import { config } from "dotenv";
config();
import axios from "axios";
import { createConnection } from "typeorm";
import dbConfig from "../dbConfig";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "images";

(async () => {
  const conn = await createConnection({ ...dbConfig, synchronize: true });
  console.log("[db:sync] schema synchronized");

  // Supabase exposes the public schema over its REST API to anyone holding
  // the anon key (which the client gets for Realtime). RLS with no policies
  // blocks that path; the server's postgres role bypasses RLS.
  const tables: { tablename: string }[] = await conn.query(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
  );
  for (const { tablename } of tables) {
    await conn.query(`ALTER TABLE public."${tablename}" ENABLE ROW LEVEL SECURITY`);
  }
  console.log(`[db:sync] RLS enabled on ${tables.length} tables`);
  await conn.close();

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.log("[db:sync] SUPABASE_URL/SERVICE_ROLE_KEY unset, skipping bucket");
    return;
  }

  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  };
  try {
    await axios.post(
      `${SUPABASE_URL}/storage/v1/bucket`,
      {
        id: BUCKET,
        name: BUCKET,
        public: true,
        file_size_limit: 5 * 1024 * 1024,
        allowed_mime_types: ["image/png", "image/jpeg", "image/webp", "image/gif"],
      },
      { headers }
    );
    console.log(`[db:sync] created public bucket "${BUCKET}"`);
  } catch (err) {
    const msg = JSON.stringify(err?.response?.data || err.message);
    if (/already exists|Duplicate/i.test(msg)) {
      console.log(`[db:sync] bucket "${BUCKET}" already exists`);
    } else {
      throw err;
    }
  }
})().catch((err) => {
  console.error(err?.response?.data || err);
  process.exit(1);
});
