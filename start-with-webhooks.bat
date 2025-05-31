@echo off
echo Starting Lightmarket Showcase with Webhook Server...
echo.

echo Starting webhook server on port 3002...
start "Webhook Server" cmd /k "npm run webhook"

timeout /t 3 /nobreak > nul

echo Starting Next.js development server on port 3000...
start "Next.js Dev Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo - Next.js App: http://localhost:3000
echo - Webhook Server: http://localhost:3002
echo.
echo Press any key to exit...
pause > nul
