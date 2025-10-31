
# Block Explorer CLI - Executable Version

## 📥 Installation

### Windows
1. Download `block-explorer.exe`
2. Run `install-windows.bat` (as Administrator for system-wide install)
3. Or just run `block-explorer.exe` directly

### macOS/Linux
1. Download the appropriate executable
2. Make it executable: `chmod +x block-explorer-macos` (or `block-explorer-linux`)
3. Run: `./block-explorer-macos --help`

## 🚀 Quick Start

```bash
# Check connection
block-explorer health

# See network info
block-explorer network

# Get block details
block-explorer block 12345

# Search for anything
block-explorer search 0x123...
```

## 🌐 Configuration

The tool connects to: http://10.10.0.60:8550

To change this, set environment variable:
```bash
set BLOCKCHAIN_RPC_URL=http://your-node:8550
```

## 📋 Commands

- `block-explorer health` - Check connection
- `block-explorer network` - Network stats
- `block-explorer block <number|hash>` - Block details
- `block-explorer blocks` - Recent blocks
- `block-explorer tx <hash>` - Transaction details
- `block-explorer account <address>` - Account info
- `block-explorer balance <address>` - Account balance
- `block-explorer search <query>` - Search anything

## ❓ Need Help?

Run: `block-explorer --help`
