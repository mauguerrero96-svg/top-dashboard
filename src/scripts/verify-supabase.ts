import fs from 'fs';
import path from 'path';

async function main() {
    console.log("🔍 Verifying Supabase connection...");

    // 1. Load .env.local manually
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        console.log("📂 Found .env.local");
        const content = fs.readFileSync(envPath, 'utf-8');
        content.split('\n').forEach(line => {
            // Basic parsing: KEY=VALUE
            if (!line || line.startsWith('#')) return;
            const [key, ...values] = line.split('=');
            if (key && values.length > 0) {
                const val = values.join('=').trim().replace(/^["']|["']$/g, '');
                process.env[key.trim()] = val;
            }
        });
    } else {
        console.warn("⚠️  .env.local file not found!");
    }

    // 2. Check variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error("❌ Missing environment variables.");
        if (!url) console.error("   - NEXT_PUBLIC_SUPABASE_URL is missing");
        if (!key) console.error("   - NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");
        console.log("\nPlease add these to your .env.local file.");
        process.exit(1);
    }

    console.log(`✅ Environment variables detected.`);
    console.log(`   URL: ${url}`);
    // Hide majority of key for security
    console.log(`   Key: ${key.substring(0, 6)}...******`);

    try {
        // 3. Import client dynamically to ensure env vars are set first
        // We assume the file is at ../lib/supabase.ts relative to this script
        // Using absolute path for safety with tsx
        const libPath = path.resolve(process.cwd(), 'src/lib/supabase.ts');

        // We can't import typescript directly with node require unless we use ts-node or tsx
        // Since we will run this with `npx tsx`, dynamic import should work if we import the file path
        // verify-supabase.ts is in src/scripts/
        const { supabase } = await import('../lib/supabase');

        // 4. Test connection
        console.log("🌐 Attempting to connect to Supabase authentication service...");
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error("❌ Supabase connection failed:", error.message);
            process.exit(1);
        }

        console.log("✅ Connection successful!");
        console.log("   Supabase client is reachable and configured correctly.");

    } catch (err: any) {
        console.error("❌ Failed to execute test:", err.message || err);
        console.error("   (Make sure you are running this with 'npx tsx')");
        process.exit(1);
    }
}

main();
