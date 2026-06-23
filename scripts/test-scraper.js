import { handler } from '../netlify/functions/scrape-webhook.js';

const mockEvent = {
  httpMethod: 'POST',
  body: '{}'
};

const mockContext = {};

console.log("==================================================");
console.log("  BALKAN TOURS COMPLAINT PIPELINE LOCAL TESTER");
console.log("==================================================");
console.log("Environment Status check:");
console.log(`- SUPABASE_URL: ${process.env.SUPABASE_URL ? "✓ SET" : "✗ NOT SET (will scrape but database insert will fail)"}`);
console.log(`- SUPABASE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY ? "✓ SET" : "✗ NOT SET"}`);
console.log(`- GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? "✓ SET" : "✗ NOT SET (will fall back to rule-based classification)"}`);
console.log(`- OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? "✓ SET" : "✗ NOT SET"}`);
console.log(`- SCRAPINGBEE_API_KEY: ${process.env.SCRAPINGBEE_API_KEY ? "✓ SET" : "✗ NOT SET (will use high-quality mock scrape database)"}`);
console.log("==================================================\n");

console.log("Starting webhook pipeline execution...");

handler(mockEvent, mockContext)
  .then(response => {
    console.log(`\nResponse Code: ${response.statusCode}`);
    const body = JSON.parse(response.body);
    
    if (response.statusCode === 200) {
      console.log("✓ Success!");
      console.log(`Processed Count: ${body.count} items.`);
      console.log("\nFirst item output structure:");
      console.log(JSON.stringify(body.items[0], null, 2));
    } else {
      console.error("✗ Failed!");
      console.error("Error message details:", body.error);
    }
  })
  .catch(err => {
    console.error("Unexpected error during pipeline run:", err);
  });
