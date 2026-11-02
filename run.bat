@echo off
title JanSahay 2.0 - Starting Full Stack Application

echo ========================================================
echo   Starting JanSahay 2.0 Full-Stack Platform
echo   Backend:  Java 17 + Spring Boot 3 + MySQL 8 (Port 8080)
echo   Frontend: React 18 + Vite (Port 5173)
echo ========================================================

echo Starting Java Spring Boot Backend Server...
start "JanSahay 2.0 - Java Backend" cmd /k "cd server && mvn spring-boot:run"

echo Starting React Vite Frontend...
start "JanSahay 2.0 - React Frontend" cmd /k "cd client && npm run dev"

echo Both services launched! Access your application at http://localhost:5173
pause
