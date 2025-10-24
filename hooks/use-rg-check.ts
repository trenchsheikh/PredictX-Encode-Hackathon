/**
 * Hook for Responsible Gambling checks
 */

import { useState, useCallback } from 'react';
import type { BetValidationResponse } from '@/types/concordium';

interface UseRGCheckProps {
  idCommitment?: string;
  userAddress?: string;
}

export function useRGCheck({ idCommitment, userAddress }: UseRGCheckProps) {
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<BetValidationResponse | null>(null);

  const checkBet = useCallback(
    async (betAmount: number): Promise<BetValidationResponse> => {
      if (!idCommitment || !userAddress) {
        return {
          allowed: false,
          reason: 'Identity verification required. Please complete Concordium verification.',
        };
      }

      setChecking(true);

      try {
        const response = await fetch('/api/rg/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userAddress,
            betAmount,
            idCommitment,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to check bet');
        }

        const result = data.data as BetValidationResponse;
        setLastCheck(result);
        return result;
      } catch (error) {
        const errorResult: BetValidationResponse = {
          allowed: false,
          reason: error instanceof Error ? error.message : 'Failed to validate bet',
        };
        setLastCheck(errorResult);
        return errorResult;
      } finally {
        setChecking(false);
      }
    },
    [idCommitment, userAddress]
  );

  const recordBet = useCallback(
    async (betAmount: number): Promise<boolean> => {
      if (!idCommitment) {
        return false;
      }

      try {
        const response = await fetch('/api/rg/record-bet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idCommitment,
            betAmount,
          }),
        });

        const data = await response.json();
        return data.success;
      } catch (error) {
        console.error('Error recording bet:', error);
        return false;
      }
    },
    [idCommitment]
  );

  return {
    checkBet,
    recordBet,
    checking,
    lastCheck,
  };
}

