import pg from 'pg';

// Testing via the direct connection
const connectionString = "postgresql://postgres:Ask123789*Ask@db.ordbhropgcgihlxjwgck.supabase.co:5432/postgres";

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
