import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format BNB amount for display
export function formatBNB(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount) || numAmount === 0) return '0.000';
  if (numAmount < 0.001) return '<0.001';
  return numAmount.toFixed(3);
}

// Calculate potential payout based on shares and pool distribution
export function calculatePayout(
  userShares: number,
  totalShares: number,
  totalPool: number
): number {
  if (totalShares === 0) return 0;
  const sharePercentage = userShares / totalShares;
  return totalPool * sharePercentage;
}

// Format wallet address for display
export function formatAddress(address: string, length: number = 6): string {
  if (!address) return '';
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

// Format time remaining for display
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
