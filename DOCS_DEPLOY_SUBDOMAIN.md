---
description: Deploy Application to a Subdomain
---

# Deploying to a Subdomain (e.g., app.yourdomain.com)

Since I cannot directly access your hosting provider account (like Vercel, Netlify, or your Domain Registrar), you will need to perform a few manual configuration steps.

## Step 1: Configure your DNS (Domain Provider)

Go to where you bought your domain (GoDaddy, Namecheap, Route53, etc.) and add a **CNAME Record**:

1.  **Type**: `CNAME`
2.  **Name (Host)**: `subdomain` (e.g., write `app` if you want `app.yoursite.com`)
3.  **Value (Points to)**:
    *   **Vercel**: `cname.vercel-dns.com`
    *   **Netlify**: `your-app-name.netlify.app`
    *   **Other**: Check your hosting provider's documentation.
4.  **TTL**: Default or 3600

## Step 2: Configure your Hosting Provider

### If using Vercel (Recommended for Next.js):
1.  Go to your Project Settings.
2.  Click on **"Domains"**.
3.  Enter your full subdomain: `app.yoursite.com`.
4.  Vercel will verify the CNAME record you added in Step 1.
5.  Once verified (usually takes minutes), it will automatically issue an SSL certificate (HTTPS).

## Step 3: Update Environment Variables (If needed)

If your app uses the URL for redirects (like Auth confirmation emails or Stripe callbacks), you need to update your environment variables in your hosting dashboard:

*   **NEXT_PUBLIC_SITE_URL**: `https://app.yoursite.com`
*   **NEXT_PUBLIC_SUPABASE_REDIRECT_URL**: `https://app.yoursite.com/auth/callback` (Example)

## Step 4: Supabase Configuration (Authentication)

If you are using Supabase Auth (Magic Links or OAuth):
1.  Go to your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
2.  Add `https://app.yoursite.com/**` to the **Site URL** or **Redirect URLs** whitelist.
3.  This ensures users are redirected back to the correct specific subdomain after logging in.

## Step 5: Middleware (Optional - For Advanced Multi-Tenancy)

If you meant that you want *dynamic* subdomains (like `clientA.site.com`, `clientB.site.com`) pointing to the *same* app but showing different data, that requires code changes in `middleware.ts`. Since you asked to "put it as a subdomain" (singular), likely Step 1-4 is what you need.
