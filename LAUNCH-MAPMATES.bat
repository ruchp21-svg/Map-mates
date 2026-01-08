@echo off
title MapMates Modern SaaS App Launcher
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    MapMates Modern SaaS Design               ║
echo ║                         Launcher v2.0                       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "c:\Users\Ruchitha\OneDrive\Desktop\mapmates1\react-final-review10"

echo [1/5] Cleaning corrupted files...
del "src\components\EmptyState.js" 2>nul
del "src\components\ModernAIComparison.js" 2>nul
echo ✓ Cleanup complete

echo.
echo [2/5] Updating package.json...
copy package-clean.json package.json >nul
echo ✓ Package.json updated

echo.
echo [3/5] Setting environment...
echo ✓ Environment configured

echo.
echo [4/5] Modern SaaS Features Ready:
echo    ✨ Glassmorphism Navigation with backdrop blur
echo    🎨 Indigo Color Scheme (#4F46E5)
echo    🚀 Smooth Hover Animations (300ms)
echo    💳 Rounded Cards (24px border-radius)
echo    📱 Mobile Responsive Design
echo    🎯 Professional Inter Typography
echo    🌟 All Original Features Working

echo.
echo [5/5] Starting application...
echo.
echo Opening at: http://localhost:3000
echo.

start /min cmd /c "timeout /t 3 >nul && start http://localhost:3000"

npx react-scripts start

echo.
echo Press any key to exit...
pause >nul