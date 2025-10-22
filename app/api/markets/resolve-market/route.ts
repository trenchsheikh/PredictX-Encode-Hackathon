import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const RENDER_BACKEND_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.BACKEND_URL || 'https://darkbet.onrender.com'
    : process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = `${RENDER_BACKEND_URL}/api/markets/resolve-market`;

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
  } catch (error: any) {
    console.error('Error proxying to backend:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to resolve market on backend',
      },
      { status: 500 }
    );
  }
}
