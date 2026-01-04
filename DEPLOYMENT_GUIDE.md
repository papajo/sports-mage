# Deployment Guide - SportsMage

This guide covers deploying SportsMage to GitHub, Vercel, and Netlify.

## Prerequisites

- GitHub account
- Vercel account (free tier available) OR Netlify account (free tier available)
- Node.js 18+ installed locally

## Step 1: Push to GitHub

### 1.1 Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: SportsMage betting application"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Repository name: `sports-mage` (or your preferred name)
4. Description: "Sports betting application built with Next.js"
5. Choose Public or Private
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### 1.3 Push to GitHub

GitHub will show you commands. Run these in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sports-mage.git

# Rename default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**If you get authentication errors:**
- Use a Personal Access Token instead of password
- Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
- Generate new token with `repo` scope
- Use token as password when pushing

## Step 2: Deploy to Vercel (Recommended for Next.js)

Vercel is the recommended platform for Next.js applications as it's made by the Next.js team.

### 2.1 Deploy via Vercel Dashboard

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your GitHub repository (`sports-mage`)
4. Vercel will auto-detect Next.js settings:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)
5. Click "Deploy"

### 2.2 Configure Environment Variables (if needed)

If you have API keys or environment variables:

1. Go to Project Settings → Environment Variables
2. Add variables:
   - `API_SPORTS_KEY` (if using API-Sports)
   - `SPORTRADAR_KEY` (if using SportRadar)
   - Any other API keys you need

### 2.3 Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 2.4 Deploy via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Step 3: Deploy to Netlify (Alternative)

### 3.1 Deploy via Netlify Dashboard

1. Go to [Netlify](https://netlify.com) and sign in with GitHub
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: `./`
5. Click "Deploy site"

### 3.2 Update Netlify Configuration

Create `netlify.toml` in the root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 3.3 Configure Environment Variables

1. Go to Site settings → Environment variables
2. Add your API keys and environment variables

### 3.4 Deploy via Netlify CLI (Alternative)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

## Step 4: Post-Deployment Checklist

### 4.1 Verify Deployment

- [ ] Visit your deployed URL
- [ ] Test all pages load correctly
- [ ] Test betting functionality
- [ ] Check console for errors
- [ ] Verify API routes work (if connected)

### 4.2 Environment Variables

Make sure all required environment variables are set:
- [ ] API keys for external services
- [ ] Database connection strings (if using)
- [ ] Any other configuration values

### 4.3 Database Setup (if using Cloudflare D1)

If you're using Cloudflare D1:
1. Set up D1 database in Cloudflare dashboard
2. Run migrations
3. Update environment variables with database binding

### 4.4 Continuous Deployment

Both Vercel and Netlify automatically deploy on push to main branch:
- Push to `main` → Automatic deployment
- Create pull request → Preview deployment

## Troubleshooting

### Build Fails

**Error: Module not found**
- Check all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: TypeScript errors**
- Fix TypeScript errors locally first
- Run `npm run build` locally to test

**Error: Environment variables missing**
- Add all required variables in deployment platform settings

### Runtime Errors

**404 errors on routes**
- Verify Next.js app directory structure
- Check `next.config.js` for any redirects/rewrites

**API routes not working**
- Check API route paths match Next.js conventions
- Verify environment variables are set
- Check server logs in deployment platform

### Performance Issues

**Slow initial load**
- Enable Next.js Image Optimization
- Check bundle size with `npm run build`
- Consider code splitting for large components

## Recommended: Vercel vs Netlify

### Choose Vercel if:
- ✅ You want the best Next.js integration
- ✅ You need edge functions
- ✅ You want automatic optimizations
- ✅ You prefer the developer experience

### Choose Netlify if:
- ✅ You need more build time (Vercel: 45min, Netlify: 300min on free tier)
- ✅ You prefer Netlify's form handling
- ✅ You need specific Netlify features

## Next Steps

1. **Set up monitoring**: Add error tracking (Sentry, etc.)
2. **Set up analytics**: Add Google Analytics or similar
3. **Configure custom domain**: Point your domain to deployment
4. **Set up staging environment**: Use preview deployments for testing
5. **Database setup**: Connect your database (Cloudflare D1, etc.)

## Support

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Next.js Deployment: https://nextjs.org/docs/deployment

