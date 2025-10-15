import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBNB(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Format with appropriate decimal places based on value
  if (num >= 1000) {
    return `${num.toFixed(0)} BNB`;
  } else if (num >= 100) {
    return `${num.toFixed(0)} BNB`;
  } else if (num >= 1) {
    return `${num.toFixed(2)} BNB`;
  } else if (num >= 0.01) {
    return `${num.toFixed(3)} BNB`;
  } else {
    return `${num.toFixed(4)} BNB`;
  }
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimeRemaining(timestamp: number): string {
  const now = Date.now();
  const diff = timestamp - now;

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function calculatePayout(
  shares: number,
  totalWinningShares: number,
  totalPool: number
): number {
  if (totalWinningShares === 0) return 0;
  return (shares / totalWinningShares) * totalPool * 0.9; // 90% after 10% platform fee
}
