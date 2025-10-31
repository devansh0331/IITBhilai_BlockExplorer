@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    BLOCK EXPLORER CLI - UNINSTALLER
echo ========================================
echo.
echo This will remove Block Explorer from your system.
echo.
echo Press Ctrl+C to cancel, or any key to continue...
pause >nul

echo.
echo 🔧 Checking administrator privileges...
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo ❌ ERROR: Administrator privileges required!
    echo Please run as administrator.
    echo.
    pause
    exit /b 1
)

set "INSTALL_DIR=%ProgramFiles%\BlockExplorer"

:: Remove from PATH
echo 🔗 Removing from system PATH...
for /f "skip=2 tokens=1,2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do (
    if /i "%%a" equ "Path" (
        set "CURRENT_PATH=%%c"
    )
)

:: Remove installation directory from PATH
set "NEW_PATH=%CURRENT_PATH:;%INSTALL_DIR%=%"
set "NEW_PATH=%NEW_PATH:%%INSTALL_DIR%=%"
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path /t REG_EXPAND_SZ /d "%NEW_PATH%" /f >nul

:: Remove installation directory
echo 📁 Removing installation directory...
if exist "%INSTALL_DIR%" (
    rmdir /s /q "%INSTALL_DIR%"
    echo ✅ Removed: %INSTALL_DIR%
) else (
    echo ℹ️  Installation directory not found
)

:: Remove desktop shortcut
echo 📋 Removing desktop shortcut...
if exist "%USERPROFILE%\Desktop\Block Explorer CLI.lnk" (
    del "%USERPROFILE%\Desktop\Block Explorer CLI.lnk"
    echo ✅ Removed desktop shortcut
)

echo.
echo ========================================
echo    ✅ UNINSTALLATION COMPLETE!
echo ========================================
echo.
echo Block Explorer CLI has been removed from your system.
echo.
pause
