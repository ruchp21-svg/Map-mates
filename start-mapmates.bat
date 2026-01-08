@echo off
setlocal

REM Add common Node.js paths
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

echo Checking Node.js installation...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js not found in PATH. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Node.js found. Starting MapMates...
echo.

REM Change to project directory
cd /d "%~dp0"

REM Install dependencies
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Starting development server...
echo The app will open at http://localhost:3000
echo Look for the robot icon in the bottom-right corner!
echo.

call npm start

pause