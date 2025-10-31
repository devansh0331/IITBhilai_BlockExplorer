@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    BLOCK EXPLORER CLI - GLOBAL INSTALLER
echo ========================================
echo.
echo This will install block-explorer so you can run it from ANY folder!
echo.
echo Requirements:
echo ✅ Windows 10/11
echo ✅ Administrator privileges
echo.
echo Press Ctrl+C to cancel, or any key to continue...
pause >nul

echo.
echo 🔧 Checking administrator privileges...
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo ❌ ERROR: Administrator privileges required!
    echo.
    echo Please right-click on this file and select:
    echo "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo ✅ Administrator privileges confirmed
echo.

:: Create installation directory
set "INSTALL_DIR=%ProgramFiles%\BlockExplorer"
echo 📁 Creating installation directory: %INSTALL_DIR%
if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
) else (
    echo 📁 Directory already exists, updating...
)

:: Copy executable
echo 📦 Copying files...
copy "block-explorer.exe" "%INSTALL_DIR%\" >nul

:: Add to system PATH
echo 🔗 Adding to system PATH...
for /f "skip=2 tokens=1,2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do (
    if /i "%%a" equ "Path" (
        set "CURRENT_PATH=%%c"
    )
)

:: Check if already in PATH
echo "%CURRENT_PATH%" | find /i "%INSTALL_DIR%" >nul
if %errorLevel% equ 0 (
    echo ✅ Already in PATH
) else (
    set "NEW_PATH=%CURRENT_PATH%;%INSTALL_DIR%"
    reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path /t REG_EXPAND_SZ /d "%NEW_PATH%" /f >nul
    echo ✅ Added to system PATH
)

:: Create desktop shortcut (optional)
echo 📋 Creating desktop shortcut...
set SCRIPT="%TEMP%%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = "%USERPROFILE%\Desktop\Block Explorer CLI.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%INSTALL_DIR%\block-explorer.exe" >> %SCRIPT%
echo oLink.Arguments = "health" >> %SCRIPT%
echo oLink.Description = "Block Explorer CLI" >> %SCRIPT%
echo oLink.WorkingDirectory = "%USERPROFILE%" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%
cscript /nologo %SCRIPT%
del %SCRIPT%

echo.
echo ========================================
echo    ✅ INSTALLATION COMPLETE!
echo ========================================
echo.
echo 🎉 Block Explorer CLI is now installed globally!
echo.
echo You can now run from ANY command prompt:
echo.
echo    block-explorer health
echo    block-explorer network
echo    block-explorer blocks
echo.
echo 📋 Try these commands:
echo    block-explorer health
echo    block-explorer network  
echo    block-explorer blocks
echo    block-explorer block 891800
echo.
echo 🖱️  A shortcut has been created on your desktop.
echo.
echo 🔄 You may need to restart Command Prompt for changes to take effect.
echo.
pause
