$ErrorActionPreference = "Continue"
Set-Location "c:\Users\Ruchitha\OneDrive\Desktop\mapmates1\react-final-review10"
Write-Host "Starting MapMates server..." -ForegroundColor Green
$env:SKIP_PREFLIGHT_CHECK = "true"
$env:BROWSER = "none"
npm start
