
# IIT Bhilai Block Explorer CLI

A simple command-line tool to explore a IIT Bhilai blockchain using an RPC endpoint.  
It allows you to view blocks, transactions, accounts, and network status easily.

## Prerequisites

- Node.js (v14+ recommended)
- Access to a blockchain RPC endpoint

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project directory:
   ```env
   BLOCKCHAIN_RPC_URL=http://YOUR_RPC_URL_HERE
   ```

 

3. (Optional) To use as a global CLI command:
   ```bash
   npm link
   ```

## Usage

If installed globally:
```bash
block-explorer <command>
```

If running directly:
```bash
node index.js <command>
```

## Commands

### Block Commands

| Command | Description | Example |
|--------|-------------|---------|
| `block <number/hash>` | Show details of a block | `block-explorer block 100` |
| `latest-block` | Show the most recent block number | `block-explorer latest-block` |
| `blocks -l <limit>` | Show recent blocks (default: 10) | `block-explorer blocks -l 5` |

### Transaction Commands

| Command | Description | Example |
|--------|-------------|---------|
| `tx <hash>` | Show transaction details | `block-explorer tx 0x123...` |
| `recent-txs -l <limit>` | Show recent transactions | `block-explorer recent-txs -l 20` |

### Account Commands

| Command | Description | Example |
|--------|-------------|---------|
| `account <address>` | Show account details + recent transfers | `block-explorer account 0xabc...` |
| `balance <address>` | Show account balance | `block-explorer balance 0xabc...` |

### Network & Search Commands

| Command | Description | Example |
|--------|-------------|---------|
| `network` | Show network statistics | `block-explorer network` |
| `search <query>` | Search blocks, txs, or addresses | `block-explorer search 0xabc...` |
| `health` | Check RPC connectivity | `block-explorer health` |

## Examples

Get latest block:
```bash
block-explorer latest-block
```

Get transaction details:
```bash
block-explorer tx 0x123abc...
```

Check account:
```bash
block-explorer account 0x89d...
```

## Features

- Block and transaction exploration
- Account type detection (wallet or smart contract)
- Recent transaction listings
- Network status display
- Clear formatted table outputs

## License

This project is for internal/educational use. Modify freely.


## 📥 Quick Download (No Installation Needed)

### For Windows Users:
1. **[Download block-explorer.exe](dist/block-explorer.exe)**
2. Double-click or run from command prompt:
   ```cmd
   block-explorer.exe health
   block-explorer.exe network