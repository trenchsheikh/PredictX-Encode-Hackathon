# Fix Node.js PATH issue
# Run this script as Administrator

# Add Node.js to current session PATH
$env:PATH += ";C:\Program Files\nodejs"

# Verify installation
Write-Host "Node.js version:"
& "C:\Program Files\nodejs\node.exe" --version

Write-Host "npm version:"
& "C:\Program Files\nodejs\npm.cmd" --version

# Navigate to project directory
Set-Location "C:\bnbet"

# Run the project
Write-Host "Starting development server..."
npm run dev

