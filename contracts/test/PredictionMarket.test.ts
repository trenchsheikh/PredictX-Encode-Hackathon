import { expect } from 'chai';
import { ethers } from 'hardhat';
import { PredictionMarket, Vault } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { time } from '@nomicfoundation/hardhat-network-helpers';

describe('PredictionMarket', function () {
    let predictionMarket: PredictionMarket;
    let vault: Vault;
    let owner: SignerWithAddress;
    let resolver: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let user3: SignerWithAddress;

    const TYPICAL_BET = ethers.parseEther('0.01');

    beforeEach(async function () {
        [owner, resolver, user1, user2, user3] = await ethers.getSigners();

        // Deploy Vault
        const VaultFactory = await ethers.getContractFactory('Vault');
        vault = await VaultFactory.deploy();
        await vault.waitForDeployment();

        // Deploy PredictionMarket
        const PredictionMarketFactory =
            await ethers.getContractFactory('PredictionMarket');
        predictionMarket = await PredictionMarketFactory.deploy(
            await vault.getAddress(),
            resolver.address
        );
        await predictionMarket.waitForDeployment();
    });

    describe('Market Creation', function () {
        it('Should create a market successfully', async function () {
            const title = 'Will BTC reach $100k by end of 2025?';
            const description = 'Bitcoin price prediction for Q4 2025';
            const expiresAt = (await time.latest()) + 86400; // 1 day from now
            const category = 1; // crypto

            const tx = await predictionMarket
                .connect(user1)
                .createMarket(title, description, expiresAt, category);

            await expect(tx)
                .to.emit(predictionMarket, 'MarketCreated')
                .withArgs(1, user1.address, title, expiresAt, category);

            const market = await predictionMarket.getMarket(1);
            expect(market.id).to.equal(1);
            expect(market.title).to.equal(title);
            expect(market.creator).to.equal(user1.address);
            expect(market.status).to.equal(0); // Active
        });

        it('Should fail if expiration is too soon', async function () {
            const expiresAt = (await time.latest()) + 300; // 5 minutes

            await expect(
                predictionMarket
                    .connect(user1)
                    .createMarket('Test Market', 'Description', expiresAt, 1)
            ).to.be.revertedWith('Must expire at least 15 minutes from now');
        });

        it('Should fail if expiration is too far', async function () {
            const expiresAt = (await time.latest()) + 366 * 86400; // More than 1 year

            await expect(
                predictionMarket
                    .connect(user1)
                    .createMarket('Test Market', 'Description', expiresAt, 1)
            ).to.be.revertedWith('Cannot expire more than 1 year from now');
        });

        it('Should increment market counter', async function () {
            const expiresAt = (await time.latest()) + 86400;

            await predictionMarket
                .connect(user1)
                .createMarket('Market 1', 'Desc', expiresAt, 1);
            await predictionMarket
                .connect(user1)
                .createMarket('Market 2', 'Desc', expiresAt, 1);
            await predictionMarket
                .connect(user1)
                .createMarket('Market 3', 'Desc', expiresAt, 1);

            expect(await predictionMarket.getMarketCount()).to.equal(3);
        });
    });

    describe('Commit-Reveal Betting', function () {
        let marketId: number;
        let expiresAt: number;

        beforeEach(async function () {
            expiresAt = (await time.latest()) + 86400;
            const tx = await predictionMarket
                .connect(user1)
                .createMarket('Test Market', 'Description', expiresAt, 1);
            const receipt = await tx.wait();
            marketId = 1; // First market
        });

        it('Should commit a bet successfully', async function () {
            // User wants to bet YES with salt "secret123"
            const outcome = true;
            const salt = ethers.id('secret123');
            const commitHash = ethers.solidityPackedKeccak256(
                ['bool', 'bytes32', 'address'],
                [outcome, salt, user1.address]
            );

            const tx = await predictionMarket
                .connect(user1)
                .commitBet(marketId, commitHash, {
                    value: TYPICAL_BET,
                });

            await expect(tx)
                .to.emit(predictionMarket, 'BetCommitted')
                .withArgs(marketId, user1.address, commitHash, TYPICAL_BET);

            const commitment = await predictionMarket.getCommitment(
                marketId,
                user1.address
            );
            expect(commitment.commitHash).to.equal(commitHash);
            expect(commitment.amount).to.equal(TYPICAL_BET);
            expect(commitment.revealed).to.be.false;
        });

        it('Should fail to commit with insufficient amount', async function () {
            const commitHash = ethers.solidityPackedKeccak256(
                ['bytes'],
                [ethers.toUtf8Bytes('test')]
            );

            await expect(
                predictionMarket
                    .connect(user1)
                    .commitBet(marketId, commitHash, {
                        value: ethers.parseEther('0.0005'), // Below minimum
                    })
            ).to.be.revertedWith('Bet too low');
        });

        it('Should fail to commit twice', async function () {
            const commitHash = ethers.solidityPackedKeccak256(
                ['bytes'],
                [ethers.toUtf8Bytes('test')]
            );

            await predictionMarket
                .connect(user1)
                .commitBet(marketId, commitHash, {
                    value: TYPICAL_BET,
                });

            await expect(
                predictionMarket
                    .connect(user1)
                    .commitBet(marketId, commitHash, {
                        value: TYPICAL_BET,
                    })
            ).to.be.revertedWith('Already committed');
        });

        it('Should reveal bet successfully', async function () {
            // Commit
            const outcome = true;
            const salt = ethers.id('secret123');
            const commitHash = ethers.solidityPackedKeccak256(
                ['bool', 'bytes32', 'address'],
                [outcome, salt, user1.address]
            );

            await predictionMarket
                .connect(user1)
                .commitBet(marketId, commitHash, {
                    value: TYPICAL_BET,
                });

            // Reveal
            const tx = await predictionMarket
                .connect(user1)
                .revealBet(marketId, outcome, salt);

            await expect(tx).to.emit(predictionMarket, 'BetRevealed');

            const commitment = await predictionMarket.getCommitment(
                marketId,
                user1.address
            );
            expect(commitment.revealed).to.be.true;

            const bet = await predictionMarket.getBet(marketId, user1.address);
            expect(bet.amount).to.equal(TYPICAL_BET);
            expect(bet.outcome).to.equal(outcome);
            expect(bet.claimed).to.be.false;
        });

        it('Should fail to reveal with wrong salt', async function () {
            const outcome = true;
            const salt = ethers.id('secret123');
            const wrongSalt = ethers.id('wrongsecret');
            const commitHash = ethers.solidityPackedKeccak256(
                ['bool', 'bytes32', 'address'],
                [outcome, salt, user1.address]
            );

            await predictionMarket
                .connect(user1)
                .commitBet(marketId, commitHash, {
                    value: TYPICAL_BET,
                });

            await expect(
                predictionMarket
                    .connect(user1)
                    .revealBet(marketId, outcome, wrongSalt)
            ).to.be.revertedWith('Invalid reveal');
        });

        it('Should fail to reveal with wrong outcome', async function () {
            const outcome = true;
            const salt = ethers.id('secret123');
            const commitHash = ethers.solidityPackedKeccak256(
                ['bool', 'bytes32', 'address'],
                [outcome, salt, user1.address]
            );

            await predictionMarket
                .connect(user1)
                .commitBet(marketId, commitHash, {
                    value: TYPICAL_BET,
                });

            await expect(
                predictionMarket
                    .connect(user1)
                    .revealBet(marketId, !outcome, salt)
            ).to.be.revertedWith('Invalid reveal');
        });

        it('Should update market pools after reveal', async function () {
            const outcome = true;
            const salt = ethers.id('secret123');
            const commitHash = ethers.solidityPackedKeccak256(
                ['bool', 'bytes32', 'address'],
                [outcome, salt, user1.address]
            );

            await predictionMarket
                .connect(user1)
                .commitBet(marketId, commitHash, {
                    value: TYPICAL_BET,
                });

            await predictionMarket
                .connect(user1)
                .revealBet(marketId, outcome, salt);

            const market = await predictionMarket.getMarket(marketId);
            expect(market.totalPool).to.equal(TYPICAL_BET);
            expect(market.yesPool).to.equal(TYPICAL_BET);
            expect(market.noPool).to.equal(0);
            expect(market.participants).to.equal(1);
        });
    });

    describe('Market Resolution', function () {
        let marketId: number;
        let expiresAt: number;

        beforeEach(async function () {
            expiresAt = (await time.latest()) + 3600; // 1 hour
            await predictionMarket
                .connect(user1)
                .createMarket('Test Market', 'Description', expiresAt, 1);
            marketId = 1;

            // Place some bets
            const outcome1 = true;
            const salt1 = ethers.id('secret1');
            const commitHash1 = ethers.solidityPackedKeccak256(
                ['bool', 'bytes32', 'address'],
                [outcome1, salt1, user1.address]
            );

            const outcome2 = false;
            const salt2 = ethers.id('secret2');
            const commitHash2 = ethers.solidityPackedKeccak256(
                ['bool', 'bytes32', 'address'],
                [outcome2, salt2, user2.address]
            );

            await predictionMarket
                .connect(user1)
                .commitBet(marketId, commitHash1, {
                    value: TYPICAL_BET,
                });
            await predictionMarket
                .connect(user2)
                .commitBet(marketId, commitHash2, {
                    value: TYPICAL_BET,
                });

            await predictionMarket
                .connect(user1)
                .revealBet(marketId, outcome1, salt1);
            await predictionMarket
                .connect(user2)
                .revealBet(marketId, outcome2, salt2);
        });

        it('Should resolve market successfully', async function () {
            // Fast forward past expiration
            await time.increaseTo(expiresAt + 1);

            const outcome = true;
            const reasoning = 'BTC reached $100k';

            const tx = await predictionMarket
                .connect(resolver)
                .resolveMarket(marketId, outcome, reasoning);

            await expect(tx)
                .to.emit(predictionMarket, 'MarketResolved')
                .withArgs(marketId, outcome, reasoning);

            const market = await predictionMarket.getMarket(marketId);
            expect(market.status).to.equal(2); // Resolved
            expect(market.outcome).to.equal(outcome);
            expect(market.resolutionReasoning).to.equal(reasoning);
        });

        it('Should fail to resolve before expiration', async function () {
            await expect(
                predictionMarket
                    .connect(resolver)
                    .resolveMarket(marketId, true, 'reasoning')
            ).to.be.revertedWith('Market not expired yet');
        });

        it('Should fail to resolve as non-resolver', async function () {
            await time.increaseTo(expiresAt + 1);

            await expect(
                predictionMarket
                    .connect(user1)
                    .resolveMarket(marketId, true, 'reasoning')
            ).to.be.revertedWith('Only resolver');
        });
    });

    describe('Claiming Winnings', function () {
        let marketId: number;
        let expiresAt: number;

        beforeEach(async function () {
            expiresAt = (await time.latest()) + 3600;
            await predictionMarket
                .connect(user1)
                .createMarket('Test Market', 'Description', expiresAt, 1);
            marketId = 1;

            // User1 bets YES, User2 bets NO
            const outcome1 = true;
            const salt1 = ethers.id('secret1');
            const commitHash1 = ethers.solidityPackedKeccak256(
                ['bool', 'bytes32', 'address'],
                [outcome1, salt1, user1.address]
            );

            const outcome2 = false;
            const salt2 = ethers.id('secret2');
            const commitHash2 = ethers.solidityPackedKeccak256(
                ['bool', 'bytes32', 'address'],
                [outcome2, salt2, user2.address]
            );

            await predictionMarket
                .connect(user1)
                .commitBet(marketId, commitHash1, {
                    value: TYPICAL_BET,
                });
            await predictionMarket
                .connect(user2)
                .commitBet(marketId, commitHash2, {
                    value: TYPICAL_BET,
                });

            await predictionMarket
                .connect(user1)
                .revealBet(marketId, outcome1, salt1);
            await predictionMarket
                .connect(user2)
                .revealBet(marketId, outcome2, salt2);

            // Resolve market (YES wins)
            await time.increaseTo(expiresAt + 1);
            await predictionMarket
                .connect(resolver)
                .resolveMarket(marketId, true, 'YES wins');
        });

        it('Should allow winner to claim winnings', async function () {
            const balanceBefore = await ethers.provider.getBalance(
                user1.address
            );

            const tx = await predictionMarket
                .connect(user1)
                .claimWinnings(marketId);
            const receipt = await tx.wait();
            const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

            const balanceAfter = await ethers.provider.getBalance(
                user1.address
            );

            // User1 should receive ~90% of total pool (minus gas)
            const expectedPayout = (TYPICAL_BET * 2n * 90n) / 100n;
            expect(balanceAfter + gasUsed).to.be.closeTo(
                balanceBefore + expectedPayout,
                ethers.parseEther('0.0001')
            );

            await expect(tx).to.emit(predictionMarket, 'WinningsClaimed');

            // Check bet is marked as claimed
            const bet = await predictionMarket.getBet(marketId, user1.address);
            expect(bet.claimed).to.be.true;
        });

        it('Should fail to claim twice', async function () {
            await predictionMarket.connect(user1).claimWinnings(marketId);

            await expect(
                predictionMarket.connect(user1).claimWinnings(marketId)
            ).to.be.revertedWith('Already claimed');
        });

        it('Should fail to claim as loser', async function () {
            await expect(
                predictionMarket.connect(user2).claimWinnings(marketId)
            ).to.be.revertedWith('Bet did not win');
        });

        it('Should transfer fee to vault', async function () {
            const vaultBalanceBefore = await ethers.provider.getBalance(
                await vault.getAddress()
            );

            await predictionMarket.connect(user1).claimWinnings(marketId);

            const vaultBalanceAfter = await ethers.provider.getBalance(
                await vault.getAddress()
            );

            // Vault should receive 10% fee
            const expectedFee = (TYPICAL_BET * 2n * 10n) / 100n;
            expect(vaultBalanceAfter - vaultBalanceBefore).to.equal(
                expectedFee
            );
        });
    });

    describe('Admin Functions', function () {
        it('Should allow owner to pause contract', async function () {
            await predictionMarket.connect(owner).pause();

            const expiresAt = (await time.latest()) + 86400;
            await expect(
                predictionMarket
                    .connect(user1)
                    .createMarket('Test', 'Desc', expiresAt, 1)
            ).to.be.revertedWithCustomError(predictionMarket, 'EnforcedPause');
        });

        it('Should allow owner to unpause contract', async function () {
            await predictionMarket.connect(owner).pause();
            await predictionMarket.connect(owner).unpause();

            const expiresAt = (await time.latest()) + 86400;
            await expect(
                predictionMarket
                    .connect(user1)
                    .createMarket('Test', 'Desc', expiresAt, 1)
            ).to.not.be.reverted;
        });

        it('Should allow owner to change resolver', async function () {
            await predictionMarket
                .connect(owner)
                .setResolverAddress(user3.address);
            expect(await predictionMarket.resolverAddress()).to.equal(
                user3.address
            );
        });

        it('Should allow owner to change vault', async function () {
            await predictionMarket
                .connect(owner)
                .setVaultAddress(user3.address);
            expect(await predictionMarket.vaultAddress()).to.equal(
                user3.address
            );
        });

        it('Should fail non-owner admin functions', async function () {
            await expect(
                predictionMarket.connect(user1).pause()
            ).to.be.revertedWithCustomError(
                predictionMarket,
                'OwnableUnauthorizedAccount'
            );
        });
    });
});
