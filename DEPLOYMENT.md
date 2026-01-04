# Sports Data Hub - Deployment README

This document provides instructions for deploying the Sports Data Hub application to Cloudflare Pages with D1 database integration.

## Prerequisites

1. Cloudflare account with Pages and D1 enabled
2. API keys for:
   - API-Sports
   - SportRadar (for Tennis and Cricket data)

## Deployment Steps

### 1. Set up environment variables

Create a `.env` file based on the `.env.example` template:
```
cp .env.example .env
```

Edit the `.env` file to add your actual API keys:
```
API_SPORTS_KEY=your_actual_api_sports_key
SPORTRADAR_API_KEY=your_actual_sportradar_key
```

### 2. Initialize the database

The database schema is defined in `migrations/0001_initial.sql`. To initialize the database locally:

```bash
wrangler d1 execute DB --local --file=migrations/0001_initial.sql
```

### 3. Build the application

```bash
npm run build
```

### 4. Deploy to Cloudflare Pages

```bash
wrangler pages deploy .output
```

## Post-Deployment Configuration

After deployment, you'll need to:

1. Set up the environment variables in the Cloudflare Pages dashboard
2. Create a D1 database in Cloudflare and link it to your Pages project
3. Run the migration script against your production D1 database:
   ```
   wrangler d1 migrations apply DB --production
   ```

## Updating Data

The application includes scripts for fetching and updating sports data:

- For live updates (every minute):
  ```
  node scripts/update-live-data.js
  ```

- For full daily updates:
  ```
  node scripts/update-all-data.js
  ```

You can set up Cloudflare Workers to run these scripts on a schedule.

## Monitoring

Monitor your application using Cloudflare Analytics. Check API usage to ensure you're within the limits of your API-Sports and SportRadar plans.

## Troubleshooting

If you encounter issues:

1. Check the Cloudflare Pages logs
2. Verify your API keys are correctly set in environment variables
3. Ensure the database migrations have been applied successfully
4. Check that your Cloudflare Workers have the necessary permissions
