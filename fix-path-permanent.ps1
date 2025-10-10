# Fix Node.js PATH permanently
# Must be run as Administrator

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click on this file and select 'Run with PowerShell' as Administrator" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Adding Node.js to System PATH permanently..." -ForegroundColor Green

# Get current system PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")

# Check if Node.js is already in PATH
if ($currentPath -like "*C:\Program Files\nodejs*") {
    Write-Host "Node.js is already in your system PATH!" -ForegroundColor Yellow
} else {
    # Add Node.js to system PATH
    $newPath = $currentPath + ";C:\Program Files\nodejs"
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
    Write-Host "✅ Node.js has been added to your system PATH!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Please close and reopen your terminal, then you can run:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The change will take effect in new terminal windows." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"

