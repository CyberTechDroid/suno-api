#!/bin/bash

# STOF - AI Song Creator - Deployment Helper Script
# This script helps you prepare your app for deployment to Dokploy

echo "🎵 STOF - AI Song Creator - Deployment Helper"
echo "=============================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your service credentials (keep variable names as-is, e.g. SUNO_COOKIE)."
    echo "You can copy .env.example and fill in your values:"
    echo "  cp .env.example .env"
    exit 1
fi

echo "✅ .env file found"
echo ""

# Check if SUNO_COOKIE is set
if ! grep -q "SUNO_COOKIE=" .env || grep -q "SUNO_COOKIE=$" .env; then
    echo "⚠️  Warning: SUNO_COOKIE is not set in .env"
    echo "Please add your service cookie to the .env file (variable: SUNO_COOKIE)"
fi

# Check if TWOCAPTCHA_KEY is set
if ! grep -q "TWOCAPTCHA_KEY=" .env || grep -q "TWOCAPTCHA_KEY= #" .env; then
    echo "⚠️  Warning: TWOCAPTCHA_KEY is not set in .env"
    echo "It's recommended to add your 2Captcha API key to avoid CAPTCHA issues"
fi

echo ""
echo "📦 Building the application..."
echo ""

# Install dependencies
echo "Installing dependencies..."
pnpm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Build the app
echo "Building Next.js application..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Display next steps
echo "🎉 Your app is ready for deployment!"
echo ""
echo "Next steps for Dokploy deployment:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add song creator app'"
echo "   git push origin main"
echo ""
echo "2. In Dokploy:"
echo "   - Create new application"
echo "   - Source: GitHub"
echo "   - Select your repository"
echo "   - Build Command: pnpm install && pnpm build"
echo "   - Start Command: pnpm start"
echo "   - Port: 3000"
echo ""
echo "3. Add these environment variables in Dokploy:"
echo "   SUNO_COOKIE=<your-cookie>"
echo "   TWOCAPTCHA_KEY=<your-api-key>"
echo "   BROWSER=chromium"
echo "   BROWSER_GHOST_CURSOR=false"
echo "   BROWSER_LOCALE=en"
echo "   BROWSER_HEADLESS=true"
echo "   NODE_ENV=production"
echo ""
echo "4. Deploy and enjoy! 🚀"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
echo "For quick start guide, see QUICKSTART.md"
