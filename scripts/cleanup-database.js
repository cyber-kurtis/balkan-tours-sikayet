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

  console.log("Removing mock and old simulated complaints (ID starts with 'sikayet-', 'google-', 'forum-')...");
  const { error: err1 } = await supabase
    .from('balkan_sikayetleri')
    .delete()
    .like('sikayet_id', 'sikayet-%');
    
  const { error: err2 } = await supabase
    .from('balkan_sikayetleri')
    .delete()
    .like('sikayet_id', 'google-%');
    
  const { error: err3 } = await supabase
    .from('balkan_sikayetleri')
    .delete()
    .like('sikayet_id', 'forum-%');

  if (err1 || err2 || err3) {
    console.error("✗ Failed to delete some mock/simulated complaints.");
  } else {
    console.log("✓ Mock and old simulated complaints successfully deleted from Supabase!");
  }
}

main();
