import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || "https://ordbhropgcgihlxjwgck.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZGJocm9wZ2NnaWhseGp3Z2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMTE1NTMsImV4cCI6MjA5Njc4NzU1M30.9NkzQ_b8weuqybC50Tcdzpg8aGjFMTr9fpd3SXqUHuA";

async function main() {
  console.log("Connecting to Supabase at:", supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Fetching all complaints from database...");
  const { data: complaints, error } = await supabase
    .from('balkan_sikayetleri')
    .select('id, sikayet_id, baslik, acenta_adi, sikayet_url');

  if (error) {
    console.error("✗ Failed to fetch complaints:", error.message);
    process.exit(1);
  }

  console.log(`Loaded ${complaints.length} complaints. Checking for bot and broken complaints...`);

  const toDelete = [];

  for (const comp of complaints) {
    const { id, sikayet_id, baslik, acenta_adi, sikayet_url } = comp;
    
    // 1. Check ID patterns
    const isMockId = 
      sikayet_id.startsWith('sikayet-') || 
      sikayet_id.startsWith('sikayetvar-') || 
      sikayet_id.startsWith('google-') || 
      sikayet_id.startsWith('forum-') || 
      sikayet_id.startsWith('mock-');

    if (isMockId) {
      console.log(`[-] Marking for deletion (Mock ID): ${baslik} (ID: ${sikayet_id})`);
      toDelete.push(id);
      continue;
    }

    // 2. Check brand name / Ustour
    if (acenta_adi === 'Ustour' || (baslik + ' ' + acenta_adi).toLowerCase().includes('ustour')) {
      console.log(`[-] Marking for deletion (Ustour Bot): ${baslik} (ID: ${sikayet_id})`);
      toDelete.push(id);
      continue;
    }

    // 3. Check URL structure (must contain specific complaint path)
    if (sikayet_url) {
      try {
        const urlObj = new URL(sikayet_url);
        if (urlObj.hostname.includes('sikayetvar.com')) {
          const pathParts = urlObj.pathname.split('/').filter(Boolean);
          if (pathParts.length < 2) {
            console.log(`[-] Marking for deletion (Brand URL instead of complaint): ${baslik} (URL: ${sikayet_url})`);
            toDelete.push(id);
            continue;
          }
        }
      } catch (err) {
        console.log(`[-] Marking for deletion (Invalid URL): ${baslik} (URL: ${sikayet_url})`);
        toDelete.push(id);
        continue;
      }
    } else {
      console.log(`[-] Marking for deletion (Empty URL): ${baslik}`);
      toDelete.push(id);
      continue;
    }

    // 4. Check URL status (broken link check)
    try {
      const res = await fetch(sikayet_url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(5000)
      });
      if (res.status === 404 || res.status === 410) {
        console.log(`[-] Marking for deletion (Broken link - Status ${res.status}): ${baslik} (URL: ${sikayet_url})`);
        toDelete.push(id);
      }
    } catch (err) {
      console.log(`[-] Marking for deletion (Fetch failed): ${baslik} (Error: ${err.message})`);
      toDelete.push(id);
    }
  }

  if (toDelete.length > 0) {
    console.log(`\nDeleting ${toDelete.length} complaints from database...`);
    const { error: delError } = await supabase
      .from('balkan_sikayetleri')
      .delete()
      .in('id', toDelete);

    if (delError) {
      console.error("✗ Failed to delete complaints:", delError.message);
    } else {
      console.log(`✓ Successfully deleted ${toDelete.length} bot/broken complaints!`);
    }
  } else {
    console.log("\nNo bot or broken complaints found to delete.");
  }
}

main();
