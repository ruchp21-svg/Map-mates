@echo off
cd /d "c:\Users\Ruchitha\OneDrive\Desktop\mapmates1\react-final-review10"
echo Starting MapMates with Modern SaaS Design...
echo.
echo Trying npm start...
npm start
if %errorlevel% neq 0 (
    echo.
    echo npm start failed, trying npx...
    npx react-scripts start
)
if %errorlevel% neq 0 (
    echo.
    echo npx failed, trying direct node command...
    node node_modules/react-scripts/bin/react-scripts.js start
)
pause