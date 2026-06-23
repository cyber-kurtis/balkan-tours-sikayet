import pg from 'pg';

// Testing via the Supabase pooler
const connectionString = "postgresql://postgres.ordbhropgcgihlxjwgck:Ask123789*Ask@aws-0-eu-west-1.pooler.supabase.com:5432/postgres";

async function main() {
  console.log("Testing database connection to pooler for project ordbhropgcgihlxjwgck...");
  const client = new pg.Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("✓ Connection SUCCESSFUL! The pooler and password work.");
  } catch (err) {
    console.error("✗ Connection FAILED:", err.message);
  } finally {
    await client.end();
  }
}

main();
