/**
 * POST /api/rg/set-limit
 * Set or update user betting limits
 */

import { NextRequest, NextResponse } from 'next/server';
import { setUserLimits, getUserRGStatus } from '@/lib/concordium-service';
import type { RGLimits } from '@/types/concordium';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idCommitment, limits } = body as {
      idCommitment: string;
      limits: Partial<RGLimits>;
    };

    // Validate inputs
    if (!idCommitment || !limits) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: idCommitment, limits',
        },
        { status: 400 }
      );
    }

    // Validate limits are positive
    if (limits.dailyLimit !== undefined && limits.dailyLimit < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Daily limit must be >= 0',
        },
        { status: 400 }
      );
    }

    if (limits.weeklyLimit !== undefined && limits.weeklyLimit < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Weekly limit must be >= 0',
        },
        { status: 400 }
      );
    }

    if (limits.monthlyLimit !== undefined && limits.monthlyLimit < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Monthly limit must be >= 0',
        },
        { status: 400 }
      );
    }

    if (limits.singleBetLimit !== undefined && limits.singleBetLimit < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Single bet limit must be >= 0',
        },
        { status: 400 }
      );
    }

    // Validate limit hierarchy: daily <= weekly <= monthly
    const currentStatus = await getUserRGStatus(idCommitment);
    if (!currentStatus) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found. Please complete identity verification first.',
        },
        { status: 404 }
      );
    }

    const newLimits = { ...currentStatus.limits, ...limits };
    if (newLimits.dailyLimit > newLimits.weeklyLimit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Daily limit cannot exceed weekly limit',
        },
        { status: 400 }
      );
    }

    if (newLimits.weeklyLimit > newLimits.monthlyLimit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Weekly limit cannot exceed monthly limit',
        },
        { status: 400 }
      );
    }

    // Set limits
    const result = await setUserLimits(idCommitment, limits);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to set limits',
        },
        { status: 500 }
      );
    }

    // Get updated status
    const updatedStatus = await getUserRGStatus(idCommitment);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Limits updated successfully',
        limits: updatedStatus?.limits,
      },
    });
  } catch (error) {
    console.error('Error setting limits:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

