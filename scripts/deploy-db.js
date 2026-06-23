import pg from 'pg';
import fs from 'fs';
import path from 'path';

// Using direct database connection instead of pooler
const connectionString = "postgresql://postgres:Ask123789*Ask@db.gmjblzdfbrmnhidorwun.supabase.co:5432/postgres";

async function main() {
  console.log("Connecting directly to Supabase PostgreSQL database...");
  const client = new pg.Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("✓ Connected successfully!");

    const schemaPath = path.resolve('supabase', 'schema.sql');
    console.log(`Reading SQL schema from ${schemaPath}...`);
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log("Executing SQL schema commands...");
    await client.query(sql);
    console.log("✓ SQL Schema executed successfully! Table and indexes are created in Supabase.");
  } catch (err) {
    console.error("✗ Database deployment failed:", err.message);
  } finally {
    await client.end();
  }
}

main();
