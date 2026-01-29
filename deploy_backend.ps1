# Deploy Backend to Netlify
Write-Host "Starting Deployment..."

# Install CLI if needed (using cmd /c to be safe)
cmd /c "npm install -g netlify-cli"

# Build
cd server
cmd /c "npm install"
cmd /c "npm run build"

# Deploy
Write-Host "Deploying..."
if (-not (Test-Path ".netlify")) {
    cmd /c "netlify init"
}

cmd /c "netlify deploy --prod"

Write-Host "Done! Update your Frontend VITE_API_URL."
Read-Host "Press Enter"
