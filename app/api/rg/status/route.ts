/**
 * GET /api/rg/status
 * Get user RG status and limits
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserRGStatus } from '@/lib/concordium-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idCommitment = searchParams.get('idCommitment');

    // Validate input
    if (!idCommitment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameter: idCommitment',
        },
        { status: 400 }
      );
    }

    // Get RG status
    const status = await getUserRGStatus(idCommitment);

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found. Please complete identity verification first.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('Error fetching RG status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

