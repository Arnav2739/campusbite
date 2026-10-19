@echo off
TITLE CampusBite - Dev Server Runner
COLOR 06

echo ===================================================================
echo                     CampusBite Development Server
echo            Campus Canteen Pre-Ordering System (FSD Project)
echo ===================================================================
echo.

:: 1. Ensure server/.env exists
IF NOT EXIST "%~dp0server\.env" (
    echo [*] server\.env not found. Copying from server\.env.example...
    copy "%~dp0server\.env.example" "%~dp0server\.env" >nul
    echo [OK] server\.env created.
)

:: 2. Check Backend Dependencies
IF NOT EXIST "%~dp0server\node_modules" (
    echo [*] Installing backend dependencies...
    pushd "%~dp0server"
    call npm install
    popd
)

:: 3. Check Frontend Dependencies
IF NOT EXIST "%~dp0client\node_modules" (
    echo [*] Installing frontend dependencies...
    pushd "%~dp0client"
    call npm install
    popd
)

:: 4. Verify & Auto-Start MongoDB
echo [*] Checking MongoDB container...
docker compose -f "%~dp0docker-compose.yml" up -d 2>nul
IF %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB is running on port 27017.
) ELSE (
    echo [!] Notice: Docker was not detected. Ensure local MongoDB is running on port 27017.
)

echo.
echo [*] Launching Backend Server on http://localhost:5000 ...
start "CampusBite Backend (Port 5000)" /D "%~dp0server" cmd /k "npm run dev"

echo [*] Launching Frontend Server on http://localhost:5173 ...
start "CampusBite Frontend (Port 5173)" /D "%~dp0client" cmd /k "npm run dev"

echo.
echo ===================================================================
echo [SUCCESS] Both servers launched!
echo - Backend API:  http://localhost:5000
echo - Frontend UI:  http://localhost:5173
echo ===================================================================
echo.

ping 127.0.0.1 -n 4 >nul
start http://localhost:5173
exit /b 0
