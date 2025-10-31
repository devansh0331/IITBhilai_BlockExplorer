const fs = require('fs');
const path = require('path');

console.log('🚀 Creating installer package for global usage...');

// Create distribution folder
const distFolder = 'block-explorer-global';
if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder);
}

// Copy the executable
fs.copyFileSync('bin/block-explorer.exe', path.join(distFolder, 'block-explorer.exe'));

// Create the main installer
const installerBat = `@echo off
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
set "INSTALL_DIR=%ProgramFiles%\\BlockExplorer"
echo 📁 Creating installation directory: %INSTALL_DIR%
if not exist "%INSTALL_DIR%" (
    mkdir "%INSTALL_DIR%"
) else (
    echo 📁 Directory already exists, updating...
)

:: Copy executable
echo 📦 Copying files...
copy "block-explorer.exe" "%INSTALL_DIR%\\" >nul

:: Add to system PATH
echo 🔗 Adding to system PATH...
for /f "skip=2 tokens=1,2*" %%a in ('reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path 2^>nul') do (
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
    reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path /t REG_EXPAND_SZ /d "%NEW_PATH%" /f >nul
    echo ✅ Added to system PATH
)

:: Create desktop shortcut (optional)
echo 📋 Creating desktop shortcut...
set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = "%USERPROFILE%\\Desktop\\Block Explorer CLI.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%INSTALL_DIR%\\block-explorer.exe" >> %SCRIPT%
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
`;

fs.writeFileSync(path.join(distFolder, 'INSTALL-GLOBAL.bat'), installerBat);

// Create portable version (no install required)
const portableBat = `@echo off
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
start cmd /k "cd /d \"%~dp0\" && echo ✅ Now you can run: block-explorer.exe health"
`;

fs.writeFileSync(path.join(distFolder, 'RUN-PORTABLE.bat'), portableBat);

// Create uninstaller
const uninstallerBat = `@echo off
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

set "INSTALL_DIR=%ProgramFiles%\\BlockExplorer"

:: Remove from PATH
echo 🔗 Removing from system PATH...
for /f "skip=2 tokens=1,2*" %%a in ('reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path 2^>nul') do (
    if /i "%%a" equ "Path" (
        set "CURRENT_PATH=%%c"
    )
)

:: Remove installation directory from PATH
set "NEW_PATH=%CURRENT_PATH:;%INSTALL_DIR%=%"
set "NEW_PATH=%NEW_PATH:%%INSTALL_DIR%=%"
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" /v Path /t REG_EXPAND_SZ /d "%NEW_PATH%" /f >nul

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
if exist "%USERPROFILE%\\Desktop\\Block Explorer CLI.lnk" (
    del "%USERPROFILE%\\Desktop\\Block Explorer CLI.lnk"
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
`;

fs.writeFileSync(path.join(distFolder, 'UNINSTALL.bat'), uninstallerBat);

// Create README
const readme = `# Block Explorer CLI - Global Installation

## 🎯 Two Ways to Use:

### Option 1: Global Install (Recommended)
1. **Run INSTALL-GLOBAL.bat as Administrator**
2. Then use from ANY command prompt:
   \`\`\`cmd
   block-explorer health
   block-explorer network
   block-explorer blocks
   \`\`\`

### Option 2: Portable Version
1. **Run RUN-PORTABLE.bat**
2. Use from this folder only:
   \`\`\`cmd
   block-explorer.exe health
   \`\`\`

## 🚀 Quick Commands to Try:

\`\`\`bash
# After global installation:
block-explorer health
block-explorer network
block-explorer blocks
block-explorer block 891800
block-explorer account 0xYourAddress

# Portable version (from this folder):
block-explorer.exe health
block-explorer.exe network
\`\`\`

## 📋 All Available Commands:

- \`block-explorer health\` - Check connection
- \`block-explorer network\` - Network stats
- \`block-explorer blocks\` - Recent blocks
- \`block-explorer block <number>\` - Block details
- \`block-explorer tx <hash>\` - Transaction details
- \`block-explorer account <address>\` - Account info
- \`block-explorer balance <address>\` - Balance only
- \`block-explorer search <query>\` - Search anything
- \`block-explorer --help\` - See all commands

## 🌐 Connection Info:
- **Node:** http://10.10.0.60:8550
- **Latest Block:** 891813 (tested)

## ⚠️ Windows Security:
You may need to click "More info" → "Run anyway" for the installer.

## 🗑️ To Uninstall:
Run \`UNINSTALL.bat\` as Administrator.
`;

fs.writeFileSync(path.join(distFolder, 'README.txt'), readme);

console.log('✅ Global installer package created!');
console.log('📁 Folder: ' + distFolder);
console.log('');
console.log('📦 Files included:');
console.log('   🔧 INSTALL-GLOBAL.bat - Global installer (run as admin)');
console.log('   ⚡ RUN-PORTABLE.bat   - Portable version (no install)');
console.log('   🗑️  UNINSTALL.bat     - Uninstaller');
console.log('   📖 README.txt         - Instructions');
console.log('   🎯 block-explorer.exe - Main executable');
console.log('');
console.log('🎯 Next: Zip this folder and upload to GitHub!');