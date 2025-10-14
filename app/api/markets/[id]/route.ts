import { NextRequest, NextResponse } from 'next/server';
import { connectDatabase } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDatabase();

    const marketId = params.id;

    // TODO: Implement actual database query
    // For now, return placeholder data
    const market = {
      id: marketId,
      title: 'Sample Market',
      description: 'This is a sample market',
      status: 'active',
      category: 'crypto',
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    };

    return NextResponse.json({
      success: true,
      data: market,
    });
  } catch (error: any) {
    console.error('Error fetching market:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch market',
      },
      { status: 500 }
    );
  }
}
