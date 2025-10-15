import { NextRequest, NextResponse } from 'next/server';

const RENDER_BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const marketId = params.id;
    const url = `${RENDER_BACKEND_URL}/api/markets/${marketId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching market:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch market from backend',
      },
      { status: 500 }
    );
  }
}
