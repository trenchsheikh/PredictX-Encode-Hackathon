#!/usr/bin/env node

/**
 * Clear Markets via API Script
 *
 * This script calls the backend API to clear all markets.
 * The backend must be running for this to work.
 *
 * Usage: node scripts/clear-markets-api.js
 */

const https = require('https');
const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const ADMIN_KEY = 'admin123';

async function clearMarkets() {
  try {
    console.log('🧹 Clearing all markets via API...');
    console.log(`📡 Backend URL: ${BACKEND_URL}`);
    console.log('');

    // Check if backend is running
    console.log('🔍 Checking if backend is running...');
    const healthCheck = await fetch(`${BACKEND_URL}/api/health`);
    if (!healthCheck.ok) {
      throw new Error(`Backend is not running. Status: ${healthCheck.status}`);
    }
    console.log('✅ Backend is running');

    // Clear all markets
    console.log('🗑️  Clearing all markets...');
    const response = await fetch(`${BACKEND_URL}/api/markets/clear-all`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminKey: ADMIN_KEY,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Markets cleared successfully!');
      console.log(`   Deleted ${result.data.deletedMarkets} markets`);
      console.log(`   Deleted ${result.data.deletedCommitments} commitments`);
      console.log(`   Deleted ${result.data.deletedBets} bets`);
      console.log('');
      console.log('🎉 Database is now empty and ready for fresh markets!');
    } else {
      throw new Error(`API returned error: ${result.error}`);
    }

  } catch (error) {
    console.error('❌ Error clearing markets:', error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   1. Make sure the backend is running: npm run dev (in backend folder)');
    console.log('   2. Check if MongoDB is running');
    console.log('   3. Verify the backend URL is correct');
    console.log('   4. Check backend logs for errors');
    process.exit(1);
  }
}

// Run the script
clearMarkets();
