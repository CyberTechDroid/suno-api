# Suno AI Song Creator - Deployment Guide

## 🚀 Deploy to Dokploy

This guide will help you deploy the Suno AI Song Creator app to your Dokploy server.

### Prerequisites

1. A Dokploy server set up and running
2. A Suno.ai account with an active subscription
3. Your Suno cookie (see instructions below)
4. A 2Captcha API key (optional but recommended)

### Step 1: Get Your Suno Cookie

1. Go to [suno.com/create](https://suno.com/create) in your browser
2. Open Developer Tools (F12)
3. Go to the Network tab
4. Refresh the page
5. Find a request with `?__clerk_api_version` in the name
6. Click on it and go to the Headers tab
7. Find the `Cookie` section and copy the entire cookie value

### Step 2: Get 2Captcha API Key (Optional)

1. Register at [2captcha.com](https://2captcha.com)
2. Top up your balance
3. Get your API key from the dashboard

### Step 3: Deploy on Dokploy

#### Option A: Deploy from GitHub

1. Fork or clone this repository to your GitHub account
2. In Dokploy, create a new application
3. Choose "GitHub" as the source
4. Select your repository
5. Configure the build settings:
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`
   - **Port**: `3000`

6. Add environment variables:
   ```env
   SUNO_COOKIE=<your-suno-cookie>
   TWOCAPTCHA_KEY=<your-2captcha-api-key>
   BROWSER=chromium
   BROWSER_GHOST_CURSOR=false
   BROWSER_LOCALE=en
   BROWSER_HEADLESS=true
   NODE_ENV=production
   ```

7. Deploy the application

#### Option B: Deploy using Docker

1. In Dokploy, create a new application
2. Choose "Docker Compose" as the source
3. Use the provided `docker-compose.yml` file
4. Add the environment variables as shown above
5. Deploy

### Step 4: Configure Domain (Optional)

1. In Dokploy, go to your application settings
2. Add your custom domain
3. Enable SSL/TLS (Let's Encrypt)
4. Save and redeploy

### Step 5: Access Your App

Your app will be available at:
- `http://your-server-ip:3000` (without domain)
- `https://your-domain.com` (with domain configured)

Visit `/creator` to access the song creator interface:
- `http://your-server-ip:3000/creator`
- `https://your-domain.com/creator`

## 📱 Using the App

### Simple Mode
1. Enter a description of the song you want to create
2. Optionally check "Make it instrumental"
3. Click "Create Song"
4. Wait for the songs to generate (2 songs will be created)

### Custom Mode
1. Enter a song title
2. Specify the music style/genre
3. Either:
   - Write your own lyrics, OR
   - Enter a prompt and click "Auto-Generate Lyrics"
4. Click "Create Song"

### View Your Songs
- Click "My Songs" to see all your previously created songs
- Each song card shows:
  - Cover image
  - Status (complete, streaming, submitted, etc.)
  - Audio player (when complete)
  - Lyrics (expandable)
  - Duration

## 🔧 Environment Variables Explained

- `SUNO_COOKIE`: Your Suno account cookie (required)
- `TWOCAPTCHA_KEY`: Your 2Captcha API key for solving CAPTCHAs (optional)
- `BROWSER`: Browser to use (`chromium` or `firefox`, chromium recommended)
- `BROWSER_GHOST_CURSOR`: Use ghost cursor simulation (false recommended)
- `BROWSER_LOCALE`: Browser locale (en recommended)
- `BROWSER_HEADLESS`: Run browser in headless mode (true for servers)

## 📊 API Endpoints

The app provides the following API endpoints:

- `POST /api/generate` - Generate music (simple mode)
- `POST /api/custom_generate` - Generate music (custom mode)
- `POST /api/generate_lyrics` - Generate lyrics from prompt
- `GET /api/get` - Get all songs
- `GET /api/get?ids=id1,id2` - Get specific songs by ID
- `GET /api/get_limit` - Get account quota information

Full API documentation available at `/docs`

## 💡 Tips

1. **Credits**: Each song generation uses 10 credits and creates 2 variations
2. **Polling**: Songs take 1-3 minutes to generate, the app automatically polls for updates
3. **Cookie Expiry**: If you get errors, your cookie may have expired - get a new one
4. **CAPTCHA**: If you encounter many CAPTCHAs, ensure your 2Captcha key is configured

## 🐛 Troubleshooting

### App won't start
- Check that all environment variables are set correctly
- Ensure `SUNO_COOKIE` is valid and not expired
- Check Dokploy logs for detailed error messages

### Songs stuck in "submitted" status
- This is normal, songs take time to generate
- Wait 2-3 minutes and refresh
- Check your Suno account quota

### CAPTCHA errors
- Add your `TWOCAPTCHA_KEY` to environment variables
- Ensure your 2Captcha account has sufficient balance
- Try using macOS for fewer CAPTCHAs (if possible)

## 📚 Resources

- [Suno AI](https://suno.com)
- [2Captcha](https://2captcha.com)
- [Dokploy Documentation](https://docs.dokploy.com)
- [Original Suno API Repository](https://github.com/gcui-art/suno-api)

## 🎉 Enjoy!

You now have your own Suno AI song creator running on your Dokploy server! Create amazing music and have fun! 🎵
