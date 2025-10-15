import { ethers } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    console.log('🚀 Starting DarkBet contracts deployment...\n');

    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();

    console.log('📡 Network:', network.name, `(Chain ID: ${network.chainId})`);
    console.log('👤 Deploying with account:', deployer.address);
    console.log(
        '💰 Account balance:',
        ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
        'BNB\n'
    );

    // Deploy Vault
    console.log('📦 Deploying Vault...');
    const VaultFactory = await ethers.getContractFactory('Vault');
    const vault = await VaultFactory.deploy();
    await vault.waitForDeployment();
    const vaultAddress = await vault.getAddress();
    console.log('✅ Vault deployed to:', vaultAddress);

    // Deploy PredictionMarket
    console.log('\n📦 Deploying PredictionMarket...');
    const PredictionMarketFactory =
        await ethers.getContractFactory('PredictionMarket');
    const predictionMarket = await PredictionMarketFactory.deploy(
        vaultAddress,
        deployer.address // Use deployer as initial resolver
    );
    await predictionMarket.waitForDeployment();
    const predictionMarketAddress = await predictionMarket.getAddress();
    console.log('✅ PredictionMarket deployed to:', predictionMarketAddress);

    // Authorize PredictionMarket to send fees to Vault
    console.log('\n🔐 Authorizing PredictionMarket to send fees to Vault...');
    const tx = await vault.authorizeContract(predictionMarketAddress);
    await tx.wait();
    console.log('✅ Authorization complete');

    // Prepare deployment info
    const deploymentInfo = {
        network: network.name,
        chainId: Number(network.chainId),
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            Vault: {
                address: vaultAddress,
                abi: 'Vault.json',
            },
            PredictionMarket: {
                address: predictionMarketAddress,
                abi: 'PredictionMarket.json',
            },
        },
    };

    // Save deployment info
    const networkName =
        network.chainId === 97n
            ? 'bscTestnet'
            : network.chainId === 56n
              ? 'bscMainnet'
              : network.chainId === 1337n
                ? 'localhost'
                : 'unknown';

    const deploymentsDir = path.join(
        __dirname,
        '../../deployments',
        networkName
    );
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(deploymentsDir, 'contracts.json');
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

    // Copy ABIs
    const artifactsDir = path.join(__dirname, '../artifacts/contracts');

    // Copy Vault ABI
    const vaultArtifact = JSON.parse(
        fs.readFileSync(path.join(artifactsDir, 'Vault.sol/Vault.json'), 'utf8')
    );
    fs.writeFileSync(
        path.join(deploymentsDir, 'Vault.json'),
        JSON.stringify(vaultArtifact.abi, null, 2)
    );

    // Copy PredictionMarket ABI
    const predictionMarketArtifact = JSON.parse(
        fs.readFileSync(
            path.join(
                artifactsDir,
                'PredictionMarket.sol/PredictionMarket.json'
            ),
            'utf8'
        )
    );
    fs.writeFileSync(
        path.join(deploymentsDir, 'PredictionMarket.json'),
        JSON.stringify(predictionMarketArtifact.abi, null, 2)
    );

    console.log('✅ ABIs copied to deployments folder');

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 DEPLOYMENT COMPLETE');
    console.log('='.repeat(60));
    console.log('\n📋 Contract Addresses:');
    console.log('   Vault:            ', vaultAddress);
    console.log('   PredictionMarket: ', predictionMarketAddress);
    console.log('\n🔗 Next Steps:');
    console.log('   1. Verify contracts on BSCScan (if on testnet/mainnet):');
    console.log(
        `      npx hardhat verify --network ${networkName} ${vaultAddress}`
    );
    console.log(
        `      npx hardhat verify --network ${networkName} ${predictionMarketAddress} ${vaultAddress} ${deployer.address}`
    );
    console.log('\n   2. Update backend .env with contract addresses');
    console.log('\n   3. Set resolver address if needed:');
    console.log(`      predictionMarket.setResolverAddress(RESOLVER_ADDRESS)`);
    console.log('\n📄 Deployment details saved to:');
    console.log(`   ${deploymentFile}`);
    console.log('\n✨ Ready to build backend API!');
    console.log('='.repeat(60) + '\n');
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('❌ Deployment failed:');
        console.error(error);
        process.exit(1);
    });
