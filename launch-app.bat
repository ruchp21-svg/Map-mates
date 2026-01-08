@echo off
echo ========================================
echo   MapMates Modern SaaS Design Launcher
echo ========================================
echo.

cd /d "c:\Users\Ruchitha\OneDrive\Desktop\mapmates1\react-final-review10"

echo Step 1: Cleaning up corrupted files...
if exist "src\components\EmptyState.js" del "src\components\EmptyState.js"
if exist "src\components\ModernAIComparison.js" del "src\components\ModernAIComparison.js"

echo Step 2: Clearing npm cache...
npm cache clean --force 2>nul

echo Step 3: Setting environment variables...
set SKIP_PREFLIGHT_CHECK=true
set GENERATE_SOURCEMAP=false
set ESLINT_NO_DEV_ERRORS=true

echo Step 4: Starting the application...
echo.
echo ✨ Modern SaaS Features Ready:
echo   - Glassmorphism Navigation
echo   - Indigo Color Scheme (#4F46E5)
echo   - Rounded Cards with Animations
echo   - Professional Typography
echo   - Mobile Responsive Design
echo.

npx --yes react-scripts start

if %errorlevel% neq 0 (
    echo.
    echo ❌ npx failed, trying alternative method...
    node node_modules\react-scripts\bin\react-scripts.js start
)

if %errorlevel% neq 0 (
    echo.
    echo ❌ All methods failed. Opening design preview...
    start design-preview.html
)

pause