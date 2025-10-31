@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    BLOCK EXPLORER CLI - PORTABLE VERSION
echo ========================================
echo.
echo This version doesn't require installation!
echo Just run commands from this folder.
echo.
echo Quick commands to try:
echo   block-explorer.exe health
echo   block-explorer.exe network
echo   block-explorer.exe blocks
echo.
echo Or add this folder to your PATH manually:
echo 1. Press Win+R, type: systempropertiesadvanced
echo 2. Click "Environment Variables"
echo 3. Edit "Path", add this folder's full path
echo.
echo Press any key to open this folder in Command Prompt...
pause >nul

:: Open command prompt in current directory
start cmd /k "cd /d "%~dp0" && echo ✅ Now you can run: block-explorer.exe health"
