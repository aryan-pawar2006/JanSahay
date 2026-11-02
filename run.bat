@echo off
title JanSahay 2.0 - Starting Full Stack Application

echo ========================================================
echo   Starting JanSahay 2.0 Full-Stack Platform
echo   Backend:  Java 17 + Spring Boot 3 + MySQL 8 (Port 8080)
echo   Frontend: React 18 + Vite (Port 5173)
echo ========================================================

echo [1/2] Starting Java Spring Boot Backend Server...
start "JanSahay 2.0 - Java Backend (Port 8080)" cmd /k "cd server && java -jar target\jansahay-backend-1.0.0.jar"

echo [2/2] Starting React Vite Frontend...
start "JanSahay 2.0 - React Frontend (Port 5173)" cmd /k "cd client && npm run dev"

echo.
echo ========================================================
echo Both services launched successfully!
echo.
echo - Web Application:  http://localhost:5173
echo - API Backend:       http://localhost:8080/api/schemes
echo ========================================================
echo.
pause
