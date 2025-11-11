# 🎵 STOF - AI Song Creator - Quick Start

## What You Have Now

I've created a beautiful web application for you to create songs using the STOF AI backend. Here's what's included:

### ✨ Features

1. **Simple Mode**: Just describe your song idea and let AI do the rest
2. **Custom Mode**: Full control over lyrics, style, and title
3. **Auto Lyrics Generation**: Generate lyrics from a prompt
4. **Real-time Status Updates**: Watch your songs being created
5. **Song Library**: View all your previously created songs
6. **Beautiful UI**: Modern, gradient design with animations

### 📂 Files Created

- `/src/app/creator/page.tsx` - The main song creator interface
- `/DEPLOYMENT.md` - Complete deployment guide for Dokploy
- Updated homepage with link to creator (`/src/app/page.tsx`)

## 🚀 How to Use Locally

Your app is already running! Access it at:
- **Homepage**: http://localhost:3000
- **Song Creator**: http://localhost:3000/creator
- **API Docs**: http://localhost:3000/docs

### Creating Your First Song

1. Go to http://localhost:3000/creator
2. In **Simple Mode**:
   - Type something like: "A happy song about friendship with acoustic guitar"
   - Click "🎵 Create Song"
   - Wait 2-3 minutes for generation

3. Or try **Custom Mode**:
   - Click "Custom Mode"
   - Fill in title, style, and lyrics
   - Or use "Auto-Generate Lyrics" button
   - Click "🎵 Create Song"

4. View your songs by clicking "📚 My Songs"

## 📦 Deploy to Dokploy

Follow these steps to deploy to your Dokploy server:

### Method 1: Git Deploy (Recommended)

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Add song creator app"
   git push origin main
   ```

2. **In Dokploy Dashboard**:
   - Create new application
   - Source: GitHub
   - Select your repository
   - Branch: main

3. **Build Settings**:
   ```
   Build Command: pnpm install && pnpm build
   Start Command: pnpm start
   Port: 3000
   ```

4. **Environment Variables** (in Dokploy):
   ```
   SUNO_COOKIE=<your-cookie-from-.env>
   TWOCAPTCHA_KEY=<your-2captcha-key>
   BROWSER=chromium
   BROWSER_GHOST_CURSOR=false
   BROWSER_LOCALE=en
   BROWSER_HEADLESS=true
   NODE_ENV=production
   ```

5. **Deploy** and wait for build to complete

### Method 2: Docker Deploy

1. **In Dokploy Dashboard**:
   - Create new application
   - Source: Docker Compose
   - Paste the existing `docker-compose.yml`

2. **Add Environment Variables** (same as above)

3. **Deploy**

## 🎨 Customization Ideas

You can customize the app further:

1. **Change Colors**: Edit gradient colors in `/src/app/creator/page.tsx`
2. **Add Features**:
   - Extend audio functionality
   - Add download buttons
   - Add sharing features
   - Add favorites/playlist system

3. **Modify UI**: Change layouts, add more animations, etc.

## 📊 Usage Tips

- **Credits**: Each generation uses 10 credits and creates 2 song variations
- **Generation Time**: Songs take 1-3 minutes to complete
- **Polling**: The app automatically checks for updates every 5 seconds
- **Instrumental**: Check the instrumental box if you don't want lyrics

## 🔑 Important Environment Variables

Make sure these are set in your Dokploy environment:

| Variable | Description | Required |
|----------|-------------|----------|
| `SUNO_COOKIE` | Service cookie used by the backend (keep variable name as-is) | ✅ Yes |
| `TWOCAPTCHA_KEY` | 2Captcha API key | ⚠️ Recommended |
| `BROWSER` | Browser type (chromium/firefox) | ✅ Yes |
| `BROWSER_HEADLESS` | Run in headless mode | ✅ Yes |

## 🐛 Common Issues

**Q: Songs stuck in "submitted"?**
A: This is normal. Wait 2-3 minutes. If still stuck, check your service quota.

**Q: "Failed to generate song" error?**
A: Your cookie might be expired. Get a new one from your service account page

**Q: Too many CAPTCHA challenges?**
A: Add your 2Captcha API key to environment variables

## 📱 Mobile Friendly

The app is fully responsive and works great on:
- Desktop browsers
- Tablets
- Mobile phones

## 🎯 Next Steps

1. Test the app locally at http://localhost:3000/creator
2. Create a few songs to test functionality
3. When ready, deploy to Dokploy using the guide above
4. Configure your custom domain in Dokploy
5. Share with your team!

## 📞 Need Help?

Check the detailed deployment guide in `DEPLOYMENT.md` for:
- Step-by-step Dokploy deployment
- Troubleshooting tips
- API endpoint documentation
- Advanced configuration options

---

Enjoy creating amazing music with AI! 🎵✨
