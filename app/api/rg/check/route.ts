/**
 * POST /api/rg/check
 * Pre-bet validation - check if bet is allowed based on RG limits
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateBet } from '@/lib/concordium-service';
import type { BetValidationRequest } from '@/types/concordium';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddress, betAmount, idCommitment } = body as BetValidationRequest;

    // Validate inputs
    if (!userAddress || !betAmount || !idCommitment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: userAddress, betAmount, idCommitment',
        },
        { status: 400 }
      );
    }

    // Validate bet amount is positive
    if (betAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bet amount must be greater than 0',
        },
        { status: 400 }
      );
    }

    // Check with RG system
    const validationResult = await validateBet({
      userAddress,
      betAmount,
      idCommitment,
    });

    return NextResponse.json({
      success: true,
      data: validationResult,
    });
  } catch (error) {
    console.error('Error validating bet:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

