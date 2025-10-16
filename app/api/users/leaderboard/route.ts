import { NextRequest, NextResponse } from 'next/server';

const RENDER_BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? process.env.BACKEND_URL || 'https://darkbet.onrender.com'
  : process.env.BACKEND_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = `${RENDER_BACKEND_URL}/api/users/leaderboard${queryString ? `?${queryString}` : ''}`;

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
        error: 'Failed to fetch leaderboard from backend',
      },
      { status: 500 }
    );
  }
}
