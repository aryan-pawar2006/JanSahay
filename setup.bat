@echo off
echo ================================================================
echo  JANSAHAY AI — First-Time Setup
echo  Government Scheme Discovery and Document Guidance System
echo ================================================================
echo.

REM Check Node.js
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please download from https://nodejs.org
    pause
    exit /b 1
)

echo [1/3] Installing server dependencies...
cd server
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Server install failed.
    pause
    exit /b 1
)
cd ..

echo [2/3] Installing client dependencies...
cd client
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Client install failed.
    pause
    exit /b 1
)
cd ..

echo [3/3] Creating server .env file (if not present)...
IF NOT EXIST "server\.env" (
    (
        echo PORT=5000
        echo JWT_SECRET=jansahay-super-secret-key-2026
        echo AI_PROVIDER=mock
        echo GEMINI_API_KEY=
    ) > server\.env
    echo [OK] server\.env created with defaults.
) ELSE (
    echo [OK] server\.env already exists, skipping.
)

echo.
echo ================================================================
echo  Setup Complete! Run the app with:
echo     run.bat                (double-click to launch)
echo     OR: node start-dev.js  (from this folder in terminal)
echo.
echo  Once running, open your browser:
echo     http://localhost:5173
echo ================================================================
pause
