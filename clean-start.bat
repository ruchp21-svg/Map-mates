@echo off
echo Removing problematic files...
cd /d "c:\Users\Ruchitha\OneDrive\Desktop\mapmates1\react-final-review10"

echo Deleting corrupted components...
del src\components\EmptyState.js 2>nul
del src\components\ModernAIComparison.js 2>nul
del src\components\EmptyState-fixed.js 2>nul
del src\components\ModernAIComparison-fixed.js 2>nul

echo Clearing cache...
npm cache clean --force

echo Starting clean app...
npm start

pause