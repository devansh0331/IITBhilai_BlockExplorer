
@echo off
echo Installing Block Explorer CLI...
echo.

:: Create installation directory
if not exist "%USERPROFILE%\block-explorer" mkdir "%USERPROFILE%\block-explorer"
copy "block-explorer.exe" "%USERPROFILE%\block-explorer\"

:: Add to PATH (requires admin)
setx PATH "%PATH%;%USERPROFILE%\block-explorer" /M 2>nul
if %errorlevel% neq 0 (
  echo.
  echo ⚠️  Could not add to system PATH (admin required)
  echo 📍 You can still run from: %USERPROFILE%\block-explorer\
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
