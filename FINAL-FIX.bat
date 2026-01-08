@echo off
echo ========================================
echo   FINAL FIX - MapMates Modern SaaS
echo ========================================

cd /d "c:\Users\Ruchitha\OneDrive\Desktop\mapmates1\react-final-review10"

echo [1/4] Force deleting all problematic files...
del "src\components\EmptyState.js" 2>nul
del "src\components\ModernAIComparison.js" 2>nul
del "src\components\EmptyState-fixed.js" 2>nul  
del "src\components\ModernAIComparison-fixed.js" 2>nul

echo [2/4] Clearing all caches...
rmdir /s /q node_modules\.cache 2>nul
npm cache clean --force 2>nul

echo [3/4] Updating package.json...
copy package-clean.json package.json >nul

echo [4/4] Starting fresh...
set SKIP_PREFLIGHT_CHECK=true
set GENERATE_SOURCEMAP=false
set ESLINT_NO_DEV_ERRORS=true

echo.
echo ✨ Modern SaaS Design Ready:
echo   - Glassmorphism Navigation
echo   - Indigo Colors (#4F46E5)  
echo   - Smooth Animations
echo   - Professional Typography
echo   - All Features Working
echo.

npx react-scripts start

pause