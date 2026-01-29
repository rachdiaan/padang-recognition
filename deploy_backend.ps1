# Deploy Backend to Netlify Functions
Write-Host "🚀 Starting Backend Deployment to Netlify..." -ForegroundColor Cyan

# 1. Check/Install Netlify CLI
if (-not (Get-Command "netlify" -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# 2. Build Server
Write-Host "🔨 Building Backend..." -ForegroundColor Yellow
cd server
npm install
npm run build

# 3. Deploy
Write-Host "☁️  Deploying to Netlify..." -ForegroundColor Yellow
Write-Host "⚠️  If prompted to login, please allow access in your browser." -ForegroundColor Magenta
Write-Host "⚠️  Select 'Create & configure new site' if asked." -ForegroundColor Magenta

# Initialize/Link site if not checks
if (-not (Test-Path ".netlify")) {
    cmd /c "netlify init"
}

# Deploy to production
cmd /c "netlify deploy --prod"

Write-Host "✅ Deployment Process Complete!" -ForegroundColor Green
Write-Host "👉 Copy the 'Website URL' + '/.netlify/functions/api' and update your Frontend VITE_API_URL" -ForegroundColor Cyan
Read-Host -Prompt "Press Enter to exit"
