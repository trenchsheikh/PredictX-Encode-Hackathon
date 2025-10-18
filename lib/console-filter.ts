/**
 * Console Filter - Suppress noisy browser extension errors
 * This filters out console spam from wallet extensions (Phantom, MetaMask, etc.)
 */

if (typeof window !== 'undefined') {
  const originalError = console.error;
  const originalWarn = console.warn;

  // Patterns to filter out
  const filterPatterns = [
    /\[PHANTOM\]/i,
    /Failed to send message to service worker/i,
    /Attempt to postMessage on disconnected port/i,
    /contentScript\.js/i,
    /moz-extension:\/\//i,
    /chrome-extension:\/\//i,
  ];

  // Check if message should be filtered
  const shouldFilter = (args: any[]): boolean => {
    const message = args.join(' ');
    return filterPatterns.some(pattern => pattern.test(message));
  };

  // Override console.error
  console.error = (...args: any[]) => {
    if (!shouldFilter(args)) {
      originalError.apply(console, args);
    }
  };

  // Override console.warn
  console.warn = (...args: any[]) => {
    if (!shouldFilter(args)) {
      originalWarn.apply(console, args);
    }
  };
}

export {};
