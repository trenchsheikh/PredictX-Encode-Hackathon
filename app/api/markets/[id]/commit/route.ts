import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const RENDER_BACKEND_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.BACKEND_URL || 'https://darkbet.onrender.com'
    : process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const marketId = params.id;
    const body = await request.json();
    const url = `${RENDER_BACKEND_URL}/api/markets/${marketId}/commit`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error proxying commit bet to backend:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to commit bet on backend',
      },
      { status: 500 }
    );
  }
}
