# TinyLink - Testing & Deployment Guide

## ✅ GitHub Repository
Your code is now live at: **https://github.com/pawarssujit/Tiny-Link.git**

---

## 🧪 Step-by-Step Testing Guide

### **Part 1: Local Testing**

#### Step 1: Install Dependencies
```bash
cd D:\Tiny_link\tinylink
npm install
```

#### Step 2: Set Up Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Open `.env` and add your Neon database URL:
   ```
   DATABASE_URL="postgresql://neondb_owner:npg_4J2AXhtoCFgN@ep-delicate-firefly-ahw4mn5e-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

#### Step 3: Run Database Migrations
```bash
npx prisma migrate dev
```
This creates the `Link` table in your Neon database.

#### Step 4: Start Development Server
```bash
npm run dev
```
Open **http://localhost:3000** in your browser.

---

### **Part 2: Testing Core Features**

#### ✅ Test 1: Create a Short Link
1. Go to **http://localhost:3000**
2. In the "Destination URL" field, enter: `https://www.google.com`
3. Leave "Custom back-half" empty (auto-generates a 6-character code)
4. Click **"Generate short link"**
5. **Expected**: Success message with a short URL like `http://localhost:3000/abc123`

#### ✅ Test 2: Create Link with Custom Code
1. Enter URL: `https://github.com`
2. Enter custom code: `github` (6-8 characters, letters/numbers only)
3. Click **"Generate short link"**
4. **Expected**: Short URL like `http://localhost:3000/github`

#### ✅ Test 3: Test Duplicate Code (Error Handling)
1. Try creating another link with the same custom code `github`
2. **Expected**: Error message: "That short code is already taken. Try another one."

#### ✅ Test 4: Test Redirect
1. Copy the short link from Test 1 or 2
2. Open it in a new browser tab
3. **Expected**: 
   - Redirects to the original URL (Google or GitHub)
   - Click count increases by 1

#### ✅ Test 5: View Dashboard
1. Go back to **http://localhost:3000**
2. **Expected**: 
   - See all created links in a table
   - Each link shows: Short code, Original URL, Click count, Created date, Last clicked time
   - "Total clicks" stat at the top increases

#### ✅ Test 6: Search/Filter Links
1. In the dashboard, use the search box
2. Type part of a URL or short code
3. **Expected**: Table filters to show matching links

#### ✅ Test 7: View Stats Page
1. Click on a short code in the table (or go to `/code/abc123`)
2. **Expected**: 
   - Stats page shows detailed metrics
   - Total clicks, Last clicked time, Created date, Destination URL
   - Copy and Delete buttons work

#### ✅ Test 8: Delete a Link
1. Click **"Delete"** button on any link (in table or stats page)
2. **Expected**: Link disappears from dashboard
3. Try accessing the deleted short link
4. **Expected**: 404 error (link no longer exists)

#### ✅ Test 9: Test Health Endpoint
1. Open **http://localhost:3000/healthz**
2. **Expected**: JSON response:
   ```json
   {
     "ok": true,
     "version": "1.0",
     "uptimeMs": 12345,
     "timestamp": "2025-11-27T..."
   }
   ```

#### ✅ Test 10: Test API Endpoints

**GET /api/links**
```bash
curl http://localhost:3000/api/links
```
**Expected**: JSON array of all links

**POST /api/links**
```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com", "customCode": "test123"}'
```
**Expected**: JSON with created link object

**GET /api/links/:code**
```bash
curl http://localhost:3000/api/links/test123
```
**Expected**: JSON with link stats

**DELETE /api/links/:code**
```bash
curl -X DELETE http://localhost:3000/api/links/test123
```
**Expected**: `{"ok": true}`

---

### **Part 3: Deploy to Vercel**

#### Step 1: Create Vercel Account
1. Go to **https://vercel.com**
2. Sign up/login with GitHub
3. Authorize Vercel to access your GitHub repos

#### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Find **"Tiny-Link"** repository
3. Click **"Import"**

#### Step 3: Configure Environment Variables
1. In the project settings, go to **"Environment Variables"**
2. Add these variables:

   **DATABASE_URL**
   ```
   postgresql://neondb_owner:npg_4J2AXhtoCFgN@ep-delicate-firefly-ahw4mn5e-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

   **NEXT_PUBLIC_APP_URL**
   ```
   https://your-project-name.vercel.app
   ```
   (Replace with your actual Vercel domain after first deployment)

#### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. **Expected**: ✅ Deployment successful

#### Step 5: Update NEXT_PUBLIC_APP_URL
1. After first deployment, copy your Vercel URL (e.g., `https://tiny-link-xyz.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
4. Redeploy (or it will auto-update on next push)

---

### **Part 4: Testing Deployed Version**

#### ✅ Test 1: Access Live Site
1. Open your Vercel URL (e.g., `https://tiny-link-xyz.vercel.app`)
2. **Expected**: Dashboard loads correctly

#### ✅ Test 2: Create Link on Production
1. Create a new short link
2. **Expected**: Works same as local

#### ✅ Test 3: Test Redirect on Production
1. Click the generated short link
2. **Expected**: Redirects correctly, click count increments

#### ✅ Test 4: Test Health Endpoint
1. Visit `https://your-app.vercel.app/healthz`
2. **Expected**: Returns `{"ok": true, "version": "1.0", ...}`

#### ✅ Test 5: Test API Endpoints
Use the same curl commands as local testing, but replace `localhost:3000` with your Vercel URL.

---

## 🐛 Troubleshooting

### Issue: Database Connection Errors
- **Solution**: Verify `DATABASE_URL` in Vercel environment variables
- Ensure Neon database is active (not paused)
- Check that connection string uses the **pooler** URL (contains `-pooler`)

### Issue: Build Fails on Vercel
- **Solution**: Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Prisma migrations are committed to GitHub

### Issue: Redirects Not Working
- **Solution**: Check `NEXT_PUBLIC_APP_URL` is set correctly in Vercel
- Ensure it matches your Vercel domain exactly

### Issue: 404 on Short Links
- **Solution**: Verify link exists in database (check Neon dashboard)
- Ensure short code matches exactly (case-sensitive)

---

## 📋 Pre-Submission Checklist

Before submitting your assignment, verify:

- [ ] All files pushed to GitHub
- [ ] Vercel deployment is live and accessible
- [ ] Health endpoint `/healthz` returns 200
- [ ] Can create short links via UI
- [ ] Can create short links via API (`POST /api/links`)
- [ ] Redirects work (`/:code` returns 302)
- [ ] Click count increments on redirect
- [ ] Delete works (link returns 404 after deletion)
- [ ] Stats page (`/code/:code`) displays correctly
- [ ] Search/filter works on dashboard
- [ ] All API endpoints return correct status codes (409 for duplicates, 404 for not found)

---

## 🎥 Video Walkthrough Tips

When recording your explanation video:

1. **Start with GitHub**: Show the repository structure
2. **Explain Architecture**: Next.js App Router, Prisma, Neon
3. **Show Key Files**: 
   - `prisma/schema.prisma` (database model)
   - `src/app/[shortCode]/route.ts` (redirect logic)
   - `src/app/api/links/route.ts` (API endpoints)
4. **Demo Features**: Create link, redirect, delete, stats page
5. **Show Database**: Use Prisma Studio or Neon dashboard to show data
6. **Explain Code**: Walk through how redirect increments click count
7. **Show Deployment**: Vercel dashboard, environment variables

---

## 🚀 Quick Commands Reference

```bash
# Local Development
npm install
npx prisma migrate dev
npm run dev

# Production Build
npm run build
npm run start

# Database
npx prisma studio          # Open database GUI
npx prisma migrate deploy  # Run migrations in production

# Git
git add .
git commit -m "Your message"
git push origin main
```

---

**Good luck with your submission! 🎉**

