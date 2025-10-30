#!/usr/bin/env node

const { ethers } = require('ethers');
const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const Table = require('cli-table3');

require('dotenv').config();


// Configuration
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://10.10.0.60:8550';
const provider = new ethers.JsonRpcProvider(RPC_URL);

class BlockExplorerCLI {
    constructor() {
        this.provider = provider;
        this.setupCLI();
    }

    setupCLI() {
        program
            .name('block-explorer')
            .description('CLI for Permissioned Blockchain Explorer')
            .version('1.0.0');

        // Block commands
        program
            .command('block <identifier>')
            .description('Get block details by number or hash')
            .action(this.getBlock.bind(this));

        program
            .command('latest-block')
            .description('Get the latest block number')
            .action(this.getLatestBlock.bind(this));

        program
            .command('blocks')
            .description('List recent blocks')
            .option('-l, --limit <number>', 'Number of blocks to show', '10')
            .action(this.getBlocks.bind(this));

        // Transaction commands
        program
            .command('tx <hash>')
            .description('Get transaction details by hash')
            .action(this.getTransaction.bind(this));

        program
            .command('recent-txs')
            .description('Get recent transactions')
            .option('-l, --limit <number>', 'Number of transactions to show', '10')
            .action(this.getRecentTransactions.bind(this));

        // Account commands
        program
            .command('account <address>')
            .description('Get account details and transactions')
            .action(this.getAccount.bind(this));

        program
            .command('balance <address>')
            .description('Get account balance')
            .action(this.getBalance.bind(this));

        // Network commands
        program
            .command('network')
            .description('Get network statistics')
            .action(this.getNetworkStats.bind(this));

        program
            .command('search <query>')
            .description('Search for blocks, transactions, or addresses')
            .action(this.search.bind(this));

        // Health check
        program
            .command('health')
            .description('Check blockchain connection health')
            .action(this.healthCheck.bind(this));

        program.parse();
    }

    async healthCheck() {
        try {
            this.printHeader('Blockchain Health Check');
            
            const blockNumber = await this.provider.getBlockNumber();
            const network = await this.provider.getNetwork();
            
            console.log(chalk.green('✅ Connected to blockchain'));
            console.log(`📦 Current Block: ${chalk.cyan(blockNumber)}`);
            console.log(`🔗 Chain ID: ${chalk.cyan(network.chainId)}`);
            console.log(`🌐 RPC URL: ${chalk.cyan(RPC_URL)}`);
            
        } catch (error) {
            console.log(chalk.red('❌ Connection failed:'), error.message);
        }
    }

    async getBlock(identifier) {
        try {
            let block;
            if (identifier.startsWith('0x')) {
                block = await this.provider.getBlock(identifier);
            } else {
                block = await this.provider.getBlock(parseInt(identifier));
            }

            if (!block) {
                console.log(chalk.red('Block not found'));
                return;
            }

            this.printHeader(`Block #${block.number}`);

            const blockTable = new Table({
                head: [chalk.cyan('Property'), chalk.cyan('Value')],
                colWidths: [20, 70]
            });

            blockTable.push(
                ['Number', block.number],
                ['Hash', block.hash],
                ['Parent Hash', block.parentHash],
                ['Timestamp', new Date(block.timestamp * 1000).toLocaleString()],
                ['Transactions', block.transactions.length],
                ['Gas Used', block.gasUsed?.toString() || '0'],
                ['Gas Limit', block.gasLimit?.toString() || '0'],
                ['Miner', block.miner || 'unknown'],
                ['Difficulty', block.difficulty?.toString() || '0'],
                ['Size', `${block.size || 0} bytes`]
            );

            console.log(blockTable.toString());

            if (block.transactions.length > 0) {
                console.log(`\n${chalk.cyan('Transactions:')}`);
                const txTable = new Table({
                    head: [chalk.cyan('Hash'), chalk.cyan('Type')],
                    colWidths: [66, 12]
                });

                for (const txHash of block.transactions.slice(0, 10)) {
                    try {
                        const tx = await this.provider.getTransaction(txHash);
                        if (tx) {
                            const type = tx.to ? 'Transfer' : 'Contract Creation';
                            txTable.push([txHash, type]);
                        }
                    } catch (error) {
                        txTable.push([txHash, 'Unknown']);
                    }
                }
                console.log(txTable.toString());

                if (block.transactions.length > 10) {
                    console.log(chalk.gray(`... and ${block.transactions.length - 10} more transactions`));
                }
            }

        } catch (error) {
            console.log(chalk.red('Error:'), error.message);
        }
    }

    async getLatestBlock() {
        try {
            const blockNumber = await this.provider.getBlockNumber();
            console.log(chalk.cyan('Latest Block:'), blockNumber);
        } catch (error) {
            console.log(chalk.red('Error:'), error.message);
        }
    }

    async getBlocks(options) {
        try {
            const limit = parseInt(options.limit);
            const currentBlock = await this.provider.getBlockNumber();
            
            this.printHeader(`Latest ${limit} Blocks`);

            const blocksTable = new Table({
                head: [
                    chalk.cyan('Block'),
                    chalk.cyan('Hash'),
                    chalk.cyan('Timestamp'),
                    chalk.cyan('Txs'),
                    chalk.cyan('Gas Used')
                ],
                colWidths: [8, 66, 22, 6, 12]
            });

            for (let i = currentBlock; i > Math.max(0, currentBlock - limit); i--) {
                try {
                    const block = await this.provider.getBlock(i);
                    if (block) {
                        blocksTable.push([
                            block.number,
                            block.hash,
                            new Date(block.timestamp * 1000).toLocaleString(),
                            block.transactions.length,
                            block.gasUsed?.toString() || '0'
                        ]);
                    }
                } catch (error) {
                    // Skip blocks that can't be fetched
                }
            }

            console.log(blocksTable.toString());

        } catch (error) {
            console.log(chalk.red('Error:'), error.message);
        }
    }

    async getTransaction(hash) {
        try {
            if (!hash.startsWith('0x') || hash.length !== 66) {
                console.log(chalk.red('Invalid transaction hash format'));
                return;
            }

            const tx = await this.provider.getTransaction(hash);
            if (!tx) {
                console.log(chalk.red('Transaction not found'));
                return;
            }

            const receipt = await this.provider.getTransactionReceipt(hash);
            let block = null;
            if (tx.blockNumber) {
                block = await this.provider.getBlock(tx.blockNumber);
            }

            this.printHeader(`Transaction ${hash}`);

            const txTable = new Table({
                head: [chalk.cyan('Property'), chalk.cyan('Value')],
                colWidths: [20, 70]
            });

            txTable.push(
                ['Hash', tx.hash],
                ['From', tx.from],
                ['To', tx.to || chalk.yellow('Contract Creation')],
                ['Value', `${ethers.formatEther(tx.value)} ETH`],
                ['Gas Price', tx.gasPrice ? `${ethers.formatUnits(tx.gasPrice, 'gwei')} Gwei` : '0'],
                ['Gas Limit', tx.gasLimit?.toString() || '0'],
                ['Gas Used', receipt?.gasUsed?.toString() || '0'],
                ['Nonce', tx.nonce],
                ['Block', tx.blockNumber || chalk.yellow('Pending')],
                ['Status', receipt ? (receipt.status === 1 ? chalk.green('Success') : chalk.red('Failed')) : chalk.yellow('Pending')],
                ['Timestamp', block ? new Date(block.timestamp * 1000).toLocaleString() : 'Pending']
            );

            if (receipt?.contractAddress) {
                txTable.push(['Contract Created', receipt.contractAddress]);
            }

            console.log(txTable.toString());

        } catch (error) {
            console.log(chalk.red('Error:'), error.message);
        }
    }

    async getRecentTransactions(options) {
        try {
            const limit = parseInt(options.limit);
            const currentBlock = await this.provider.getBlockNumber();
            const transactions = [];

            this.printHeader(`Recent ${limit} Transactions`);

            for (let i = currentBlock; i > Math.max(0, currentBlock - 50) && transactions.length < limit; i--) {
                try {
                    const block = await this.provider.getBlock(i);
                    if (block && block.transactions) {
                        for (const txHash of block.transactions) {
                            try {
                                const tx = await this.provider.getTransaction(txHash);
                                if (tx) {
                                    transactions.push({
                                        hash: tx.hash,
                                        from: tx.from,
                                        to: tx.to,
                                        value: ethers.formatEther(tx.value),
                                        blockNumber: tx.blockNumber,
                                        timestamp: block.timestamp
                                    });
                                    
                                    if (transactions.length >= limit) break;
                                }
                            } catch (error) {
                                // Skip transactions that can't be fetched
                            }
                        }
                    }
                } catch (error) {
                    // Skip blocks that can't be fetched
                }
            }

            const txTable = new Table({
                head: [
                    chalk.cyan('Hash'),
                    chalk.cyan('From'),
                    chalk.cyan('To'),
                    chalk.cyan('Value'),
                    chalk.cyan('Block')
                ],
                colWidths: [66, 42, 42, 12, 8]
            });

            transactions.forEach(tx => {
                const toDisplay = tx.to ? tx.to.substring(0, 40) + '...' : chalk.yellow('Contract');
                txTable.push([
                    tx.hash,
                    tx.from.substring(0, 40) + '...',
                    toDisplay,
                    parseFloat(tx.value).toFixed(4),
                    tx.blockNumber
                ]);
            });

            console.log(txTable.toString());

        } catch (error) {
            console.log(chalk.red('Error:'), error.message);
        }
    }

    async getAccount(address) {
        try {
            if (!ethers.isAddress(address)) {
                console.log(chalk.red('Invalid address format'));
                return;
            }

            const [balance, transactionCount, code] = await Promise.all([
                this.provider.getBalance(address),
                this.provider.getTransactionCount(address),
                this.provider.getCode(address)
            ]);

            const isContract = code !== '0x';

            this.printHeader(`Account ${address}`);

            const accountTable = new Table({
                head: [chalk.cyan('Property'), chalk.cyan('Value')],
                colWidths: [20, 70]
            });

            accountTable.push(
                ['Address', address],
                ['Balance', `${ethers.formatEther(balance)} ETH`],
                ['Transaction Count', transactionCount],
                ['Type', isContract ? chalk.magenta('Contract') : chalk.blue('EOA')]
            );

            if (isContract) {
                accountTable.push(['Contract Size', `${Math.floor(code.length / 2) - 1} bytes`]);
            }

            console.log(accountTable.toString());

            // Show recent transactions
            console.log(`\n${chalk.cyan('Recent Transactions:')}`);
            await this.getAccountTransactions(address, 10);

        } catch (error) {
            console.log(chalk.red('Error:'), error.message);
        }
    }

    async getAccountTransactions(address, limit = 10) {
        try {
            const currentBlock = await this.provider.getBlockNumber();
            const transactions = [];

            for (let i = currentBlock; i > Math.max(0, currentBlock - 100) && transactions.length < limit; i--) {
                try {
                    const block = await this.provider.getBlock(i);
                    if (block && block.transactions) {
                        for (const txHash of block.transactions) {
                            try {
                                const tx = await this.provider.getTransaction(txHash);
                                if (tx && (tx.from.toLowerCase() === address.toLowerCase() || 
                                          (tx.to && tx.to.toLowerCase() === address.toLowerCase()))) {
                                    transactions.push({
                                        hash: tx.hash,
                                        from: tx.from,
                                        to: tx.to,
                                        value: ethers.formatEther(tx.value),
                                        blockNumber: tx.blockNumber,
                                        direction: tx.from.toLowerCase() === address.toLowerCase() ? 'OUT' : 'IN'
                                    });
                                    
                                    if (transactions.length >= limit) break;
                                }
                            } catch (error) {
                                // Skip transactions that can't be fetched
                            }
                        }
                    }
                } catch (error) {
                    // Skip blocks that can't be fetched
                }
            }

            if (transactions.length === 0) {
                console.log(chalk.gray('No transactions found'));
                return;
            }

            const txTable = new Table({
                head: [
                    chalk.cyan('Direction'),
                    chalk.cyan('Hash'),
                    chalk.cyan('Counterparty'),
                    chalk.cyan('Value'),
                    chalk.cyan('Block')
                ],
                colWidths: [8, 66, 42, 12, 8]
            });

            transactions.forEach(tx => {
                const counterparty = tx.direction === 'OUT' ? 
                    (tx.to ? tx.to.substring(0, 40) + '...' : chalk.yellow('Contract')) : 
                    tx.from.substring(0, 40) + '...';
                
                const valueDisplay = tx.direction === 'OUT' ? 
                    chalk.red(`-${parseFloat(tx.value).toFixed(4)}`) : 
                    chalk.green(`+${parseFloat(tx.value).toFixed(4)}`);

                txTable.push([
                    tx.direction === 'OUT' ? chalk.red('OUT') : chalk.green('IN'),
                    tx.hash,
                    counterparty,
                    valueDisplay,
                    tx.blockNumber
                ]);
            });

            console.log(txTable.toString());

        } catch (error) {
            console.log(chalk.red('Error:'), error.message);
        }
    }

    async getBalance(address) {
        try {
            if (!ethers.isAddress(address)) {
                console.log(chalk.red('Invalid address format'));
                return;
            }

            const balance = await this.provider.getBalance(address);
            console.log(chalk.cyan('Balance:'), `${ethers.formatEther(balance)} ETH`);
            console.log(chalk.gray('Wei:'), balance.toString());

        } catch (error) {
            console.log(chalk.red('Error:'), error.message);
        }
    }

    async getNetworkStats() {
        try {
            this.printHeader('Network Statistics');

            const [blockNumber, network, gasPrice] = await Promise.all([
                this.provider.getBlockNumber(),
                this.provider.getNetwork(),
                this.provider.getGasPrice().catch(() => null)
            ]);

            const statsTable = new Table({
                head: [chalk.cyan('Metric'), chalk.cyan('Value')],
                colWidths: [20, 30]
            });

            statsTable.push(
                ['Current Block', blockNumber],
                ['Chain ID', network.chainId],
                ['Gas Price', gasPrice ? `${ethers.formatUnits(gasPrice, 'gwei')} Gwei` : 'N/A'],
                ['RPC URL', RPC_URL]
            );

            console.log(statsTable.toString());

        } catch (error) {
            console.log(chalk.red('Error:'), error.message);
        }
    }

    async search(query) {
        try {
            this.printHeader(`Search: "${query}"`);

            // Check if it's an address
            if (ethers.isAddress(query)) {
                console.log(chalk.green('🔍 Found: Address'));
                await this.getAccount(query);
                return;
            }

            // Check if it's a block number
            const blockNumber = parseInt(query);
            if (!isNaN(blockNumber)) {
                console.log(chalk.green('🔍 Found: Block Number'));
                await this.getBlock(blockNumber);
                return;
            }

            // Check if it's a block hash
            if (query.startsWith('0x') && query.length === 66) {
                try {
                    const block = await this.provider.getBlock(query);
                    if (block) {
                        console.log(chalk.green('🔍 Found: Block Hash'));
                        await this.getBlock(block.number);
                        return;
                    }
                } catch (error) {
                    // Not a block hash, continue
                }
            }

            // Check if it's a transaction hash
            if (query.startsWith('0x') && query.length === 66) {
                try {
                    const tx = await this.provider.getTransaction(query);
                    if (tx) {
                        console.log(chalk.green('🔍 Found: Transaction Hash'));
                        await this.getTransaction(query);
                        return;
                    }
                } catch (error) {
                    // Not a transaction hash, continue
                }
            }

            console.log(chalk.red('❌ No results found'));

        } catch (error) {
            console.log(chalk.red('Error:'), error.message);
        }
    }

    printHeader(title) {
        console.log('\n' + chalk.cyan('='.repeat(80)));
        console.log(chalk.cyan.bold(title));
        console.log(chalk.cyan('='.repeat(80)) + '\n');
    }
}

// Initialize CLI
new BlockExplorerCLI();