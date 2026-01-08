@echo off
echo Fixing corrupted component files...
cd /d "c:\Users\Ruchitha\OneDrive\Desktop\mapmates1\react-final-review10"

echo Replacing EmptyState.js...
del src\components\EmptyState.js
copy src\components\EmptyState-fixed.js src\components\EmptyState.js

echo Replacing ModernAIComparison.js...
del src\components\ModernAIComparison.js
copy src\components\ModernAIComparison-fixed.js src\components\ModernAIComparison.js

echo Starting the app...
npm start

pause