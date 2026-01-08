@echo off
cd /d "%~dp0"
echo Starting MapMates server on port 3000...
python -m http.server 3000 --directory build
pause
