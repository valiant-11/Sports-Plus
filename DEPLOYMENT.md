# SportsPlus - Vercel Deployment Guide

## Overview

This guide will help you deploy the SportsPlus Mobile App UI to Vercel in just a few minutes.

## Prerequisites

- GitHub account (repository already exists)
- Vercel account (free at [vercel.com](https://vercel.com))
- Node.js 16+ (local development)

## Quick Deployment Steps

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub repositories

### Step 2: Import Project

1. In your Vercel dashboard, click "Add New" → "Project"
2. Select "Import Git Repository"
3. Find and select `valiant-11/Sports-Plus`
4. Click "Import"

### Step 3: Configure Build Settings

Vercel should automatically detect the following settings:

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

If not auto-detected, manually set these values.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 1-2 minutes)
3. Your app is now live! 🎉

Vercel will provide you with:
- **Production URL**: https://[project-name].vercel.app
- **Git integration**: Automatic deployments on GitHub pushes

## Environment Variables

Currently, the app uses mock data and doesn't require environment variables. If you need to add API endpoints or configuration:

1. In Vercel Dashboard → Project Settings → Environment Variables
2. Add your variables (e.g., `VITE_API_URL`)
3. Redeploy

## Features Included

✅ **Optimized Build Configuration**
- Code splitting for faster load times
- Minification with Terser
- Optimized chunk sizes

✅ **Security Headers**
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Cache control

✅ **SPA Support**
- Proper URL rewrites for client-side routing
- 404 errors redirect to index.html

✅ **Performance**
- Automatic image optimization (if added)
- Edge caching for static assets
- CDN delivery worldwide

## Local Testing Before Deployment

### Build Locally

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

The preview will run on `http://localhost:4173`

## Deployment Workflow

### Automatic Deployments (Recommended)

1. Push changes to GitHub main branch
2. Vercel automatically builds and deploys
3. Preview URL generated for pull requests

### Manual Deployments

```bash
# Using Vercel CLI
npm i -g vercel
vercel
```

## Troubleshooting

### Build Fails

1. Check build logs in Vercel Dashboard
2. Verify `npm run build` works locally
3. Ensure all dependencies are in `package.json`

### App Shows Blank Page

1. Clear browser cache (Ctrl+Shift+Delete)
2. Check browser console for errors (F12)
3. Verify `index.html` has `<div id="root"></div>`

### 404 on Page Refresh

- This is handled by `vercel.json` rewrites
- If issue persists, check that `vercel.json` is in root directory

## Performance Metrics

After deployment, check performance in:

- **Vercel Analytics**: Dashboard → Project → Analytics
- **PageSpeed Insights**: https://pagespeed.web.dev
- **Lighthouse**: Built into Chrome DevTools

## Custom Domain

To add a custom domain:

1. Vercel Dashboard → Project Settings → Domains
2. Add your domain
3. Update DNS records (Vercel provides instructions)
4. Wait for DNS propagation (up to 48 hours)

## Monitoring & Updates

### Set Up Email Notifications

1. Vercel Dashboard → Account Settings → Notifications
2. Enable deployment notifications
3. Receive alerts on build failures

### Keep Dependencies Updated

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Commit and push
git add package*.json
git commit -m "Update dependencies"
git push
```

## Rollback Previous Deployment

1. Vercel Dashboard → Project → Deployments
2. Find the deployment to rollback
3. Click the three dots → "Promote to Production"

## Next Steps

- Add backend API integration
- Connect to database (Firebase, MongoDB, etc.)
- Set up authentication
- Add PWA features
- Monitor with Sentry or similar

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)

---

**Happy Deploying! 🚀**
