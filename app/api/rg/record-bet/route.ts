/**
 * POST /api/rg/record-bet
 * Record a bet after it's been placed on-chain
 */

import { NextRequest, NextResponse } from 'next/server';
import { recordBet } from '@/lib/concordium-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idCommitment, betAmount } = body;

    // Validate inputs
    if (!idCommitment || !betAmount) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: idCommitment, betAmount',
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

    // Record bet
    const result = await recordBet(idCommitment, betAmount);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to record bet',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Bet recorded successfully',
      },
    });
  } catch (error) {
    console.error('Error recording bet:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

