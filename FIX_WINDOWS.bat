@echo off
echo ==========================================
echo    PharmSpec AI - Windows Fix Script
echo ==========================================
echo.

REM Delete old empty folder
echo Removing empty folder...
rmdir /s /q "C:\Users\Mpdr_\pharmspec-real"

REM Clone fresh
echo.
echo Cloning fresh repository...
cd C:\Users\Mpdr_
git clone https://github.com/CADDMAN8055/pharmspec-real.git

REM Navigate and list files
echo.
echo Files in pharmspec-real:
cd C:\Users\Mpdr_\pharmspec-real
dir

echo.
echo ==========================================
echo Now run: python api-server.py
echo ==========================================
pause
