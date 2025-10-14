import { NextRequest, NextResponse } from 'next/server';

const RENDER_BACKEND_URL = 'https://darkbet.onrender.com';

export async function GET(request: NextRequest) {
  try {
    const url = `${RENDER_BACKEND_URL}/health`;

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
    console.error('Error proxying to backend:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check backend health',
        data: {
          status: 'unhealthy',
          timestamp: Date.now(),
        },
      },
      { status: 500 }
    );
  }
}
