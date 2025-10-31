const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building executable files...');

// Create bin directory
if (!fs.existsSync('bin')) {
  fs.mkdirSync('bin');
}

// Build for Windows
console.log('📦 Building Windows executable...');
try {
  execSync('pkg cli.js --target node18-win-x64 --output bin/block-explorer.exe', { stdio: 'inherit' });
  console.log('✅ Windows build complete');
} catch (error) {
  console.log('❌ Windows build failed');
}

// Build for macOS
console.log('📦 Building macOS executable...');
try {
  execSync('pkg cli.js --target node18-macos-x64 --output bin/block-explorer-macos', { stdio: 'inherit' });
  console.log('✅ macOS build complete');
} catch (error) {
  console.log('❌ macOS build failed');
}

// Build for Linux
console.log('📦 Building Linux executable...');
try {
  execSync('pkg cli.js --target node18-linux-x64 --output bin/block-explorer-linux', { stdio: 'inherit' });
  console.log('✅ Linux build complete');
} catch (error) {
  console.log('❌ Linux build failed');
}

// Create installers and README
createDistributionFiles();

function createDistributionFiles() {
  // Create Windows installer script
  const winInstaller = `
@echo off
echo Installing Block Explorer CLI...
echo.

:: Create installation directory
if not exist "%USERPROFILE%\\block-explorer" mkdir "%USERPROFILE%\\block-explorer"
copy "block-explorer.exe" "%USERPROFILE%\\block-explorer\\"

:: Add to PATH (requires admin)
setx PATH "%PATH%;%USERPROFILE%\\block-explorer" /M 2>nul
if %errorlevel% neq 0 (
  echo.
  echo ⚠️  Could not add to system PATH (admin required)
  echo 📍 You can still run from: %USERPROFILE%\\block-explorer\\
  echo 💡 Or add this folder to your PATH manually
) else (
  echo ✅ Added to system PATH
)

echo.
echo 🎉 Installation complete!
echo.
echo Usage:
echo   block-explorer --help
echo   block-explorer health
echo.
echo Blockchain node: http://10.10.0.60:8550
pause
`;

  fs.writeFileSync('bin/install-windows.bat', winInstaller);

  // Create simple README
  const readme = `
# Block Explorer CLI - Executable Version

## 📥 Installation

### Windows
1. Download \`block-explorer.exe\`
2. Run \`install-windows.bat\` (as Administrator for system-wide install)
3. Or just run \`block-explorer.exe\` directly

### macOS/Linux
1. Download the appropriate executable
2. Make it executable: \`chmod +x block-explorer-macos\` (or \`block-explorer-linux\`)
3. Run: \`./block-explorer-macos --help\`

## 🚀 Quick Start

\`\`\`bash
# Check connection
block-explorer health

# See network info
block-explorer network

# Get block details
block-explorer block 12345

# Search for anything
block-explorer search 0x123...
\`\`\`

## 🌐 Configuration

The tool connects to: http://10.10.0.60:8550

To change this, set environment variable:
\`\`\`bash
set BLOCKCHAIN_RPC_URL=http://your-node:8550
\`\`\`

## 📋 Commands

- \`block-explorer health\` - Check connection
- \`block-explorer network\` - Network stats
- \`block-explorer block <number|hash>\` - Block details
- \`block-explorer blocks\` - Recent blocks
- \`block-explorer tx <hash>\` - Transaction details
- \`block-explorer account <address>\` - Account info
- \`block-explorer balance <address>\` - Account balance
- \`block-explorer search <query>\` - Search anything

## ❓ Need Help?

Run: \`block-explorer --help\`
`;

  fs.writeFileSync('bin/README.md', readme);

  console.log('\n✅ Distribution files created in ./bin/');
  console.log('\n📁 Files created:');
  console.log('   📄 block-explorer.exe (Windows)');
  console.log('   📄 block-explorer-macos (macOS)');
  console.log('   📄 block-explorer-linux (Linux)');
  console.log('   📄 install-windows.bat (Windows installer)');
  console.log('   📄 README.md (Instructions)');
  console.log('\n🎯 Next: Upload the .exe file to your repository!');
}