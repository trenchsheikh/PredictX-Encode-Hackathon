import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

export interface BlockchainConfig {
  provider: ethers.JsonRpcProvider;
  predictionMarketAddress: string;
  vaultAddress: string;
  predictionMarketABI: any[];
  vaultABI: any[];
}

export function getBlockchainConfig(): BlockchainConfig {
  const rpcUrl =
    process.env.BSC_RPC_URL ||
    'https://bsc-dataseed.binance.org/';
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // Load contract addresses from deployments
  const network = process.env.NETWORK || 'bscMainnet';
  const deploymentsPath = path.join(__dirname, '../../../deployments', network);

  let predictionMarketAddress: string;
  let vaultAddress: string;
  let predictionMarketABI: any[];
  let vaultABI: any[];

  try {
    // Load contract addresses
    const contractsFile = path.join(deploymentsPath, 'contracts.json');
    const contractsData = JSON.parse(fs.readFileSync(contractsFile, 'utf8'));

    predictionMarketAddress = contractsData.contracts.PredictionMarket.address;
    vaultAddress = contractsData.contracts.Vault.address;

    // Load ABIs
    const predictionMarketABIFile = path.join(
      deploymentsPath,
      'PredictionMarket.json'
    );
    predictionMarketABI = JSON.parse(
      fs.readFileSync(predictionMarketABIFile, 'utf8')
    );

    const vaultABIFile = path.join(deploymentsPath, 'Vault.json');
    vaultABI = JSON.parse(fs.readFileSync(vaultABIFile, 'utf8'));

    console.log('✅ Loaded contract addresses from deployments');
    console.log(`   PredictionMarket: ${predictionMarketAddress}`);
    console.log(`   Vault: ${vaultAddress}`);
  } catch (error) {
    console.error(
      '⚠️  Could not load deployment files. Using environment variables.'
    );

    // Fallback to environment variables
    predictionMarketAddress = process.env.PREDICTION_MARKET_ADDRESS || '';
    vaultAddress = process.env.VAULT_ADDRESS || '';

    if (!predictionMarketAddress || !vaultAddress) {
      throw new Error(
        'Contract addresses not found. Deploy contracts first or set environment variables.'
      );
    }

    // Load ABIs from artifacts (fallback)
    try {
      const artifactsPath = path.join(
        __dirname,
        '../../../contracts/artifacts/contracts'
      );

      const predictionMarketArtifact = JSON.parse(
        fs.readFileSync(
          path.join(
            artifactsPath,
            'PredictionMarket.sol/PredictionMarket.json'
          ),
          'utf8'
        )
      );
      predictionMarketABI = predictionMarketArtifact.abi;

      const vaultArtifact = JSON.parse(
        fs.readFileSync(
          path.join(artifactsPath, 'Vault.sol/Vault.json'),
          'utf8'
        )
      );
      vaultABI = vaultArtifact.abi;

      console.log('✅ Loaded ABIs from artifacts');
    } catch (error) {
      throw new Error('Could not load ABIs. Run contract compilation first.');
    }
  }

  return {
    provider,
    predictionMarketAddress,
    vaultAddress,
    predictionMarketABI,
    vaultABI,
  };
}
