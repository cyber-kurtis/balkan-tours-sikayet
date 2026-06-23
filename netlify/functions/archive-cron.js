import { createClient } from '@supabase/supabase-js';

// Netlify Scheduled Function (Runs at 00:00 every day)
export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Missing Supabase configuration." })
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate the ISO string for 10 days ago
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    
    console.log(`Running archiving query: Archiving active records dated before ${tenDaysAgo}`);

    const { data, error } = await supabase
      .from('balkan_sikayetleri')
      .update({ durum: 'Arşiv' })
      .lt('tarih', tenDaysAgo)
      .eq('durum', 'Aktif');

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Auto-archiving completed successfully.",
        timestamp: new Date().toISOString(),
        cutoffDate: tenDaysAgo
      })
    };
  } catch (err) {
    console.error("Cron function failed:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
}
