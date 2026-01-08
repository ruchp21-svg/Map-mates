Write-Host "Deleting corrupted files..." -ForegroundColor Yellow
Set-Location "c:\Users\Ruchitha\OneDrive\Desktop\mapmates1\react-final-review10"

Remove-Item "src\components\EmptyState.js" -Force -ErrorAction SilentlyContinue
Remove-Item "src\components\ModernAIComparison.js" -Force -ErrorAction SilentlyContinue

Write-Host "Files deleted. Starting app..." -ForegroundColor Green
& npx react-scripts start

Read-Host "Press Enter to exit"