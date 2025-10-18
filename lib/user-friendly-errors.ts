/**
 * User-Friendly Error Messages
 * Converts technical blockchain and application errors into clear, actionable messages
 */

export interface UserFriendlyError {
  title: string;
  message: string;
  suggestion?: string;
  action?: string;
}

/**
 * Convert any error into a user-friendly message
 */
export function getUserFriendlyError(error: any): UserFriendlyError {
  const errorString = error?.message || error?.reason || String(error);
  const errorCode = error?.code;
  const errorData = error?.data;

  console.error('Original error:', error);

  // User rejected transaction
  if (
    errorString.includes('user rejected') ||
    errorString.includes('User denied') ||
    errorString.includes('user cancelled') ||
    errorCode === 4001 ||
    errorCode === 'ACTION_REJECTED'
  ) {
    return {
      title: 'Transaction Cancelled',
      message: 'You cancelled the transaction in your wallet.',
      suggestion: 'If this was a mistake, please try again.',
    };
  }

  // Network/RPC errors
  if (
    errorString.includes('Transaction does not have a transaction hash') ||
    errorString.includes('-32603') ||
    errorString.includes('internal error') ||
    errorString.includes('RPC')
  ) {
    return {
      title: 'Network Connection Issue',
      message: 'We had trouble connecting to the blockchain network.',
      suggestion:
        'This is usually temporary. Please wait a moment and try again.',
      action: 'Try Again',
    };
  }

  // Insufficient funds
  if (
    errorString.includes('insufficient funds') ||
    errorString.includes('not enough') ||
    errorString.includes('balance too low')
  ) {
    return {
      title: 'Insufficient Balance',
      message: "You don't have enough BNB to complete this transaction.",
      suggestion:
        'Please add more BNB to your wallet. You need enough for the bet amount plus gas fees (usually around 0.001-0.003 BNB).',
      action: 'Check Balance',
    };
  }

  // Bet too low
  if (
    errorString.includes('Bet too low') ||
    errorString.includes('bet too low')
  ) {
    return {
      title: 'Bet Amount Too Low',
      message:
        'Your bet amount is below the minimum required by the smart contract.',
      suggestion:
        'The minimum bet is typically 0.01 BNB. Please increase your bet amount and try again.',
      action: 'Increase Amount',
    };
  }

  // Gas estimation failed
  if (
    errorString.includes('gas') &&
    (errorString.includes('estimate') || errorString.includes('estimation'))
  ) {
    // Check if there's a specific reason in the error
    if (errorString.includes('Bet too low')) {
      return {
        title: 'Bet Amount Too Low',
        message: 'Your bet amount is below the minimum required.',
        suggestion:
          'The minimum bet is typically 0.01 BNB. Please increase your bet amount and try again.',
      };
    }

    if (errorString.includes('Already committed')) {
      return {
        title: 'Already Placed Bet',
        message: "You've already placed a bet on this market.",
        suggestion:
          'You can only place one bet per market. Wait for the reveal period to reveal your bet.',
        action: 'Go to My Bets',
      };
    }

    if (errorString.includes('expired')) {
      return {
        title: 'Market Closed',
        message: 'This prediction market has already closed.',
        suggestion:
          'You can no longer place bets on this market. Check out other active markets!',
        action: 'View Active Markets',
      };
    }

    return {
      title: 'Transaction Would Fail',
      message: 'This transaction cannot be completed in its current state.',
      suggestion:
        'The market may have expired, been resolved, or your bet may not meet the requirements. Please refresh the page and try again.',
      action: 'Refresh Page',
    };
  }

  // Wrong network
  if (
    errorString.includes('wrong network') ||
    errorString.includes('switch') ||
    errorString.includes('chain')
  ) {
    return {
      title: 'Wrong Network',
      message: 'Your wallet is connected to the wrong network.',
      suggestion:
        'Please switch to BNB Smart Chain (BSC Mainnet) in your wallet.',
      action: 'Switch Network',
    };
  }

  // Contract-specific errors - Market expired
  if (
    errorString.includes('Market has expired') ||
    errorString.includes('expired')
  ) {
    return {
      title: 'Market Closed',
      message: 'This prediction market has already closed.',
      suggestion:
        'You can no longer place bets on this market. Check out other active markets!',
      action: 'View Active Markets',
    };
  }

  // Already committed
  if (
    errorString.includes('already committed') ||
    errorString.includes('Already placed')
  ) {
    return {
      title: 'Already Placed Bet',
      message: "You've already placed a bet on this market.",
      suggestion:
        'You can only place one bet per market. Wait for the reveal period to reveal your bet.',
      action: 'Go to My Bets',
    };
  }

  // Not revealed yet
  if (errorString.includes('not revealed') || errorString.includes('reveal')) {
    return {
      title: 'Need to Reveal First',
      message: 'You need to reveal your bet before claiming.',
      suggestion:
        'Go to "My Bets" and reveal your bet first, then you can claim your winnings.',
      action: 'Go to My Bets',
    };
  }

  // Already claimed
  if (
    errorString.includes('already claimed') ||
    errorString.includes('claimed')
  ) {
    return {
      title: 'Already Claimed',
      message: "You've already claimed your winnings for this bet.",
      suggestion:
        'Check your transaction history to see the claim transaction.',
      action: 'View Transaction History',
    };
  }

  // Market not resolved
  if (
    errorString.includes('not resolved') ||
    errorString.includes('resolution')
  ) {
    return {
      title: 'Market Not Resolved Yet',
      message: 'This market has not been resolved yet.',
      suggestion:
        'Please wait for the market to be resolved before claiming. Resolution typically happens within 1 hour after the market expires.',
      action: 'Check Back Later',
    };
  }

  // Bet did not win
  if (
    errorString.includes('did not win') ||
    errorString.includes('lost') ||
    errorString.includes('wrong outcome')
  ) {
    return {
      title: 'Bet Did Not Win',
      message: 'Unfortunately, your prediction was not correct.',
      suggestion:
        'Better luck next time! Check out other markets to place new predictions.',
      action: 'View Active Markets',
    };
  }

  // No bet found
  if (errorString.includes('No bet found') || errorString.includes('no bet')) {
    return {
      title: 'No Bet Found',
      message: "We couldn't find a bet from your wallet on this market.",
      suggestion:
        "Make sure you're connected with the same wallet you used to place the bet.",
      action: 'Check Wallet',
    };
  }

  // Amount too low (also catches "Bet too low" from smart contract)
  if (errorString.includes('too low') || errorString.includes('minimum')) {
    return {
      title: 'Bet Amount Too Low',
      message: 'Your bet amount is below the minimum required.',
      suggestion:
        'The minimum bet is typically 0.01 BNB on this platform. Please increase your bet amount and try again.',
    };
  }

  // Amount too high
  if (errorString.includes('too high') || errorString.includes('maximum')) {
    return {
      title: 'Amount Too High',
      message: 'The bet amount exceeds the maximum allowed.',
      suggestion: 'Please reduce your bet amount and try again.',
    };
  }

  // Nonce too low (stuck transaction)
  if (errorString.includes('nonce') && errorString.includes('low')) {
    return {
      title: 'Transaction Stuck',
      message:
        'You have a pending transaction that needs to be resolved first.',
      suggestion:
        'Please wait for your pending transaction to complete, or speed it up in your wallet settings.',
      action: 'Check Wallet',
    };
  }

  // Wallet not connected
  if (
    errorString.includes('not connected') ||
    errorString.includes('No wallet') ||
    errorString.includes('connect wallet')
  ) {
    return {
      title: 'Wallet Not Connected',
      message: 'Please connect your wallet to continue.',
      suggestion: 'Click the "Connect Wallet" button to get started.',
      action: 'Connect Wallet',
    };
  }

  // Transaction timeout
  if (errorString.includes('timeout') || errorString.includes('timed out')) {
    return {
      title: 'Transaction Taking Too Long',
      message: 'The transaction is taking longer than expected.',
      suggestion:
        'The transaction might still be processing. Check your wallet or try again with higher gas.',
      action: 'Check Wallet',
    };
  }

  // Contract not found
  if (
    errorString.includes('contract not found') ||
    errorString.includes('does not exist')
  ) {
    return {
      title: 'Configuration Error',
      message: 'There was a problem connecting to the smart contract.',
      suggestion:
        "Please make sure you're on the correct network. If the problem persists, contact support.",
      action: 'Refresh Page',
    };
  }

  // Generic wallet error
  if (errorString.includes('wallet')) {
    return {
      title: 'Wallet Issue',
      message: 'There was a problem with your wallet.',
      suggestion:
        'Please check your wallet connection and try again. You may need to reconnect.',
      action: 'Reconnect Wallet',
    };
  }

  // Database/API errors
  if (
    errorString.includes('Failed to fetch') ||
    errorString.includes('Network error') ||
    errorString.includes('API')
  ) {
    return {
      title: 'Connection Problem',
      message: 'We had trouble connecting to our servers.',
      suggestion: 'Please check your internet connection and try again.',
      action: 'Try Again',
    };
  }

  // Server errors
  if (errorString.includes('500') || errorString.includes('server error')) {
    return {
      title: 'Server Issue',
      message: 'Our servers are experiencing difficulties.',
      suggestion:
        'This is usually temporary. Please try again in a few moments.',
      action: 'Try Again',
    };
  }

  // Rate limiting
  if (
    errorString.includes('rate limit') ||
    errorString.includes('too many requests')
  ) {
    return {
      title: 'Too Many Requests',
      message: "You've made too many requests too quickly.",
      suggestion: 'Please wait a moment before trying again.',
      action: 'Wait and Retry',
    };
  }

  // Invalid input
  if (
    errorString.includes('invalid') &&
    (errorString.includes('input') ||
      errorString.includes('parameter') ||
      errorString.includes('value'))
  ) {
    return {
      title: 'Invalid Input',
      message: 'Some of the information you provided is not valid.',
      suggestion: 'Please check your input and try again.',
    };
  }

  // Generic blockchain error
  if (
    errorString.includes('execution reverted') ||
    errorString.includes('revert')
  ) {
    return {
      title: 'Transaction Failed',
      message: 'The smart contract rejected this transaction.',
      suggestion:
        'This usually means the action is not allowed in the current state. Please refresh and try again.',
      action: 'Refresh Page',
    };
  }

  // Unknown error - provide helpful fallback
  return {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred.',
    suggestion:
      'Please try refreshing the page. If the problem continues, contact our support team.',
    action: 'Refresh Page',
  };
}

/**
 * Get a simple error message string (for backwards compatibility)
 */
export function getUserFriendlyErrorMessage(error: any): string {
  const friendly = getUserFriendlyError(error);
  let message = `${friendly.title}: ${friendly.message}`;
  if (friendly.suggestion) {
    message += ` ${friendly.suggestion}`;
  }
  return message;
}

/**
 * Check if an error is recoverable (user can try again)
 */
export function isRecoverableError(error: any): boolean {
  const friendly = getUserFriendlyError(error);
  const recoverableKeywords = [
    'Network Connection',
    'Connection Problem',
    'Server Issue',
    'Transaction Taking Too Long',
    'Transaction Stuck',
  ];
  return recoverableKeywords.some(keyword => friendly.title.includes(keyword));
}

/**
 * Check if error needs user to switch network
 */
export function needsNetworkSwitch(error: any): boolean {
  const friendly = getUserFriendlyError(error);
  return friendly.title.includes('Wrong Network');
}

/**
 * Check if error is due to user cancellation
 */
export function isUserCancellation(error: any): boolean {
  const friendly = getUserFriendlyError(error);
  return friendly.title.includes('Cancelled');
}
