import { ethers, Contract, EventLog } from 'ethers';
import { getBlockchainConfig } from '../config/blockchain';
import { Market } from '../models/Market';
import { Commitment } from '../models/Commitment';
import { Bet } from '../models/Bet';
import { MarketStatus } from '../types';
import { transactionHistoryService } from './TransactionHistoryService';

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private predictionMarket: Contract;
  private vault: Contract;
  private isListening: boolean = false;

  constructor() {
    const config = getBlockchainConfig();
    this.provider = config.provider;

    this.predictionMarket = new ethers.Contract(
      config.predictionMarketAddress,
      config.predictionMarketABI,
      this.provider
    );

    this.vault = new ethers.Contract(
      config.vaultAddress,
      config.vaultABI,
      this.provider
    );
  }

  /**
   * Start listening to blockchain events
   */
  async startEventListeners(): Promise<void> {
    if (this.isListening) {
      console.log('⚠️  Event listeners already running');
      return;
    }

    console.log('👂 Starting blockchain event listeners...');

    // Listen to MarketCreated events
    this.predictionMarket.on('MarketCreated', async (marketId, creator, title, expiresAt, category, event) => {
      await this.handleMarketCreated(marketId, creator, title, expiresAt, category, event);
    });

    // Listen to BetCommitted events
    this.predictionMarket.on('BetCommitted', async (marketId, user, commitHash, amount, event) => {
      await this.handleBetCommitted(marketId, user, commitHash, amount, event);
    });

    // Listen to BetRevealed events
    this.predictionMarket.on('BetRevealed', async (marketId, user, outcome, amount, shares, event) => {
      await this.handleBetRevealed(marketId, user, outcome, amount, shares, event);
    });

    // Listen to MarketResolved events
    this.predictionMarket.on('MarketResolved', async (marketId, outcome, reasoning, event) => {
      await this.handleMarketResolved(marketId, outcome, reasoning, event);
    });

    // Listen to WinningsClaimed events
    this.predictionMarket.on('WinningsClaimed', async (marketId, user, amount, event) => {
      await this.handleWinningsClaimed(marketId, user, amount, event);
    });

    this.isListening = true;
    console.log('✅ Event listeners started successfully');
  }

  /**
   * Stop listening to blockchain events
   */
  stopEventListeners(): void {
    this.predictionMarket.removeAllListeners();
    this.vault.removeAllListeners();
    this.isListening = false;
    console.log('⏹️  Event listeners stopped');
  }

  /**
   * Resolve a market (requires admin wallet)
   */
  async resolveMarket(marketId: number, outcome: boolean, reasoning: string): Promise<string> {
    try {
      // Get admin wallet from environment
      const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
      if (!adminPrivateKey) {
        throw new Error('Admin private key not configured');
      }

      const adminWallet = new ethers.Wallet(adminPrivateKey, this.provider);
      const contractWithSigner = this.predictionMarket.connect(adminWallet);

      // Call resolveMarket function
      const tx = await (contractWithSigner as any).resolveMarket(marketId, outcome, reasoning);
      const receipt = await tx.wait();

      console.log(`✅ Market ${marketId} resolved: ${outcome ? 'YES' : 'NO'}`);
      console.log(`   Transaction: ${receipt.hash}`);

      return receipt.hash;
    } catch (error: any) {
      console.error(`❌ Failed to resolve market ${marketId}:`, error);
      throw error;
    }
  }

  /**
   * Get market data from blockchain
   */
  async getMarketFromChain(marketId: number): Promise<any> {
    return await this.predictionMarket.getMarket(marketId);
  }

  /**
   * Get commitment data from blockchain
   */
  async getCommitmentFromChain(marketId: number, user: string): Promise<any> {
    return await this.predictionMarket.getCommitment(marketId, user);
  }

  /**
   * Get bet data from blockchain
   */
  async getBetFromChain(marketId: number, user: string): Promise<any> {
    return await this.predictionMarket.getBet(marketId, user);
  }

  /**
   * Get total market count from blockchain
   */
  async getMarketCount(): Promise<number> {
    const count = await this.predictionMarket.getMarketCount();
    return Number(count);
  }

  // ============ Event Handlers ============

  private async handleMarketCreated(
    marketId: bigint,
    creator: string,
    title: string,
    expiresAt: bigint,
    category: bigint,
    event: EventLog
  ): Promise<void> {
    try {
      console.log(`📢 MarketCreated: ${marketId} - ${title}`);

      // Fetch full market data from chain
      const marketData = await this.getMarketFromChain(Number(marketId));

      const market = new Market({
        marketId: Number(marketId),
        title,
        description: marketData.description,
        creator,
        createdAt: new Date(Number(marketData.createdAt) * 1000),
        expiresAt: new Date(Number(expiresAt) * 1000),
        category: Number(category),
        totalPool: marketData.totalPool.toString(),
        yesPool: marketData.yesPool.toString(),
        noPool: marketData.noPool.toString(),
        yesShares: marketData.yesShares.toString(),
        noShares: marketData.noShares.toString(),
        participants: Number(marketData.participants),
        status: Number(marketData.status),
        txHash: (event as any).transactionHash || (event as any).log?.transactionHash || 'unknown', // Get txHash from event
      });

      await market.save();
      console.log(`✅ Market ${marketId} cached in database`);

      // Record transaction
      try {
        const txHash = (event as any).transactionHash || (event as any).log?.transactionHash || 'unknown';
        const blockNumber = (event as any).blockNumber || 0;
        const timestamp = Number(marketData.createdAt) * 1000;
        
        await transactionHistoryService.recordTransaction(
          Number(marketId),
          creator,
          'create',
          txHash,
          blockNumber,
          timestamp
        );
      } catch (error) {
        console.error('Failed to record market creation transaction:', error);
      }
    } catch (error) {
      console.error(`❌ Error handling MarketCreated event:`, error);
    }
  }

  private async handleBetCommitted(
    marketId: bigint,
    user: string,
    commitHash: string,
    amount: bigint,
    event: EventLog
  ): Promise<void> {
    try {
      console.log(`📢 BetCommitted: Market ${marketId}, User ${user.slice(0, 10)}...`);

      const commitment = new Commitment({
        marketId: Number(marketId),
        user,
        commitHash,
        amount: amount.toString(),
        timestamp: new Date(),
        revealed: false,
        txHash: (event as any).transactionHash || (event as any).log?.transactionHash || 'unknown',
      });

      await commitment.save();
      console.log(`✅ Commitment cached for market ${marketId}`);

      // Record transaction
      try {
        const txHash = (event as any).transactionHash || (event as any).log?.transactionHash || 'unknown';
        const blockNumber = (event as any).blockNumber || 0;
        const timestamp = Date.now();
        
        await transactionHistoryService.recordTransaction(
          Number(marketId),
          user,
          'commit',
          txHash,
          blockNumber,
          timestamp,
          { amount: amount.toString() }
        );
      } catch (error) {
        console.error('Failed to record bet commit transaction:', error);
      }
    } catch (error) {
      // If duplicate, it's fine (already cached)
      if ((error as any).code !== 11000) {
        console.error(`❌ Error handling BetCommitted event:`, error);
      }
    }
  }

  private async handleBetRevealed(
    marketId: bigint,
    user: string,
    outcome: boolean,
    amount: bigint,
    shares: bigint,
    event: EventLog
  ): Promise<void> {
    try {
      console.log(`📢 BetRevealed: Market ${marketId}, User ${user.slice(0, 10)}..., Outcome ${outcome ? 'YES' : 'NO'}`);

      // Update commitment to revealed
      await Commitment.updateOne(
        { marketId: Number(marketId), user },
        { $set: { revealed: true } }
      );

      // Create bet record
      const bet = new Bet({
        marketId: Number(marketId),
        user,
        outcome,
        shares: shares.toString(),
        amount: amount.toString(),
        revealedAt: new Date(),
        claimed: false,
        txHash: (event as any).transactionHash || (event as any).log?.transactionHash || 'unknown',
      });

      await bet.save();

      // Update market pools and shares
      const marketData = await this.getMarketFromChain(Number(marketId));
      await Market.updateOne(
        { marketId: Number(marketId) },
        {
          $set: {
            totalPool: marketData.totalPool.toString(),
            yesPool: marketData.yesPool.toString(),
            noPool: marketData.noPool.toString(),
            yesShares: marketData.yesShares.toString(),
            noShares: marketData.noShares.toString(),
            participants: Number(marketData.participants),
          },
        }
      );

      console.log(`✅ Bet revealed and cached for market ${marketId}`);

      // Record transaction
      try {
        const txHash = (event as any).transactionHash || (event as any).log?.transactionHash || 'unknown';
        const blockNumber = (event as any).blockNumber || 0;
        const timestamp = Date.now();
        
        await transactionHistoryService.recordTransaction(
          Number(marketId),
          user,
          'reveal',
          txHash,
          blockNumber,
          timestamp,
          { 
            amount: amount.toString(),
            outcome,
            shares: shares.toString()
          }
        );
      } catch (error) {
        console.error('Failed to record bet reveal transaction:', error);
      }
    } catch (error) {
      console.error(`❌ Error handling BetRevealed event:`, error);
    }
  }

  private async handleMarketResolved(
    marketId: bigint,
    outcome: boolean,
    reasoning: string,
    event: EventLog
  ): Promise<void> {
    try {
      console.log(`📢 MarketResolved: ${marketId} - Outcome: ${outcome ? 'YES' : 'NO'}`);

      await Market.updateOne(
        { marketId: Number(marketId) },
        {
          $set: {
            status: MarketStatus.Resolved,
            outcome,
            resolutionReasoning: reasoning,
          },
        }
      );

      console.log(`✅ Market ${marketId} resolved`);

      // Record transaction
      try {
        const txHash = (event as any).transactionHash || (event as any).log?.transactionHash || 'unknown';
        const blockNumber = (event as any).blockNumber || 0;
        const timestamp = Date.now();
        
        await transactionHistoryService.recordTransaction(
          Number(marketId),
          'system', // Market resolution is system-initiated
          'resolve',
          txHash,
          blockNumber,
          timestamp,
          { outcome }
        );
      } catch (error) {
        console.error('Failed to record market resolution transaction:', error);
      }
    } catch (error) {
      console.error(`❌ Error handling MarketResolved event:`, error);
    }
  }

  private async handleWinningsClaimed(
    marketId: bigint,
    user: string,
    amount: bigint,
    event: EventLog
  ): Promise<void> {
    try {
      console.log(`📢 WinningsClaimed: Market ${marketId}, User ${user.slice(0, 10)}..., Amount ${ethers.formatEther(amount)} BNB`);

      await Bet.updateOne(
        { marketId: Number(marketId), user },
        { $set: { claimed: true } }
      );

      console.log(`✅ Claim recorded for market ${marketId}`);

      // Record transaction
      try {
        const txHash = (event as any).transactionHash || (event as any).log?.transactionHash || 'unknown';
        const blockNumber = (event as any).blockNumber || 0;
        const timestamp = Date.now();
        
        await transactionHistoryService.recordTransaction(
          Number(marketId),
          user,
          'claim',
          txHash,
          blockNumber,
          timestamp,
          { amount: amount.toString() }
        );
      } catch (error) {
        console.error('Failed to record winnings claim transaction:', error);
      }
    } catch (error) {
      console.error(`❌ Error handling WinningsClaimed event:`, error);
    }
  }

  /**
   * Sync historical events (for initial setup or resync)
   */
  async syncHistoricalEvents(fromBlock: number = 0): Promise<void> {
    console.log(`🔄 Syncing historical events from block ${fromBlock}...`);

    const latestBlock = await this.provider.getBlockNumber();
    console.log(`   Latest block: ${latestBlock}`);

    // Query past events in chunks (to avoid RPC limits)
    const chunkSize = 5000;
    for (let start = fromBlock; start <= latestBlock; start += chunkSize) {
      const end = Math.min(start + chunkSize - 1, latestBlock);
      console.log(`   Querying blocks ${start} to ${end}...`);

      // Get MarketCreated events
      const marketCreatedFilter = this.predictionMarket.filters.MarketCreated();
      const marketCreatedEvents = await this.predictionMarket.queryFilter(marketCreatedFilter, start, end);

      for (const event of marketCreatedEvents) {
        if (event instanceof EventLog) {
          const [marketId, creator, title, expiresAt, category] = event.args;
          await this.handleMarketCreated(marketId, creator, title, expiresAt, category, event);
        }
      }

      // Get BetCommitted events
      const betCommittedFilter = this.predictionMarket.filters.BetCommitted();
      const betCommittedEvents = await this.predictionMarket.queryFilter(betCommittedFilter, start, end);

      for (const event of betCommittedEvents) {
        if (event instanceof EventLog) {
          const [marketId, user, commitHash, amount] = event.args;
          await this.handleBetCommitted(marketId, user, commitHash, amount, event);
        }
      }

      // Get BetRevealed events
      const betRevealedFilter = this.predictionMarket.filters.BetRevealed();
      const betRevealedEvents = await this.predictionMarket.queryFilter(betRevealedFilter, start, end);

      for (const event of betRevealedEvents) {
        if (event instanceof EventLog) {
          const [marketId, user, outcome, amount, shares] = event.args;
          await this.handleBetRevealed(marketId, user, outcome, amount, shares, event);
        }
      }

      // Get MarketResolved events
      const marketResolvedFilter = this.predictionMarket.filters.MarketResolved();
      const marketResolvedEvents = await this.predictionMarket.queryFilter(marketResolvedFilter, start, end);

      for (const event of marketResolvedEvents) {
        if (event instanceof EventLog) {
          const [marketId, outcome, reasoning] = event.args;
          await this.handleMarketResolved(marketId, outcome, reasoning, event);
        }
      }
    }

    console.log(`✅ Historical sync complete`);
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();

