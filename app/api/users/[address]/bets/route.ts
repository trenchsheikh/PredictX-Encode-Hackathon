import { NextRequest, NextResponse } from 'next/server';

const RENDER_BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? process.env.BACKEND_URL || 'https://darkbet.onrender.com'
  : process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const userAddress = params.address;
    const url = `${RENDER_BACKEND_URL}/api/users/${userAddress}/bets`;

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
        error: 'Failed to fetch user bets from backend',
      },
      { status: 500 }
    );
  }
}
