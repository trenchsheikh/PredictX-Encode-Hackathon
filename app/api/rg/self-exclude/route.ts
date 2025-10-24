/**
 * POST /api/rg/self-exclude
 * Self-exclude user from betting for a specified duration
 */

import { NextRequest, NextResponse } from 'next/server';
import { selfExcludeUser } from '@/lib/concordium-service';
import { SELF_EXCLUSION_DURATIONS } from '@/types/concordium';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idCommitment, durationDays, reason } = body;

    // Validate inputs
    if (!idCommitment || !durationDays) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: idCommitment, durationDays',
        },
        { status: 400 }
      );
    }

    // Validate duration is one of allowed values
    if (!SELF_EXCLUSION_DURATIONS.includes(durationDays as never)) {
      return NextResponse.json(
        {
          success: false,
          error: `Duration must be one of: ${SELF_EXCLUSION_DURATIONS.join(', ')} days`,
        },
        { status: 400 }
      );
    }

    // Set self-exclusion
    const result = await selfExcludeUser(idCommitment, durationDays);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to set self-exclusion',
        },
        { status: 500 }
      );
    }

    const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Self-exclusion set successfully',
        durationDays,
        expiryDate: expiryDate.toISOString(),
        reason,
      },
    });
  } catch (error) {
    console.error('Error setting self-exclusion:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

