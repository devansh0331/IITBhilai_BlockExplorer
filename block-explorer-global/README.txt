# Block Explorer CLI - Global Installation

## 🎯 Two Ways to Use:

### Option 1: Global Install (Recommended)
1. **Run INSTALL-GLOBAL.bat as Administrator**
2. Then use from ANY command prompt:
   ```cmd
   block-explorer health
   block-explorer network
   block-explorer blocks
   ```

### Option 2: Portable Version
1. **Run RUN-PORTABLE.bat**
2. Use from this folder only:
   ```cmd
   block-explorer.exe health
   ```

## 🚀 Quick Commands to Try:

```bash
# After global installation:
block-explorer health
block-explorer network
block-explorer blocks
block-explorer block 891800
block-explorer account 0xYourAddress

# Portable version (from this folder):
block-explorer.exe health
block-explorer.exe network
```

## 📋 All Available Commands:

- `block-explorer health` - Check connection
- `block-explorer network` - Network stats
- `block-explorer blocks` - Recent blocks
- `block-explorer block <number>` - Block details
- `block-explorer tx <hash>` - Transaction details
- `block-explorer account <address>` - Account info
- `block-explorer balance <address>` - Balance only
- `block-explorer search <query>` - Search anything
- `block-explorer --help` - See all commands

## 🌐 Connection Info:
- **Node:** http://10.10.0.60:8550
- **Latest Block:** 891813 (tested)

## ⚠️ Windows Security:
You may need to click "More info" → "Run anyway" for the installer.

## 🗑️ To Uninstall:
Run `UNINSTALL.bat` as Administrator.
