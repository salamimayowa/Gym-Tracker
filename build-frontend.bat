@echo off
cd /d "%~dp0frontend"
echo Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
  echo npm install failed
  exit /b 1
)
echo Building React app...
call npm run build
if %ERRORLEVEL% neq 0 (
  echo npm build failed
  exit /b 1
)
echo Build complete!
pause
