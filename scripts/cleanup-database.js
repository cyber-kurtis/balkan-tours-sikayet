import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: SUPABASE_URL or SUPABASE_KEY environment variables are not set. Make sure to run this script with --env-file=.env");
  process.exit(1);
}

async function main() {
  console.log("Connecting to Supabase at:", supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Removing mock complaints (ID starts with 'sikayet-')...");
  const { data, error } = await supabase
    .from('balkan_sikayetleri')
    .delete()
    .like('sikayet_id', 'sikayet-%');

  if (error) {
    console.error("✗ Failed to delete mock complaints:", error.message);
  } else {
    console.log("✓ Mock complaints successfully deleted from Supabase!");
  }
}

main();
