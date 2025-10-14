import { NextRequest, NextResponse } from 'next/server';

const RENDER_BACKEND_URL = 'https://darkbet.onrender.com';

export async function GET(
  request: NextRequest,
  { params }: { params: { marketId: string } }
) {
  try {
    const marketId = params.marketId;
    const url = `${RENDER_BACKEND_URL}/api/transactions/market/${marketId}`;
    
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
        error: 'Failed to fetch transaction history from backend',
      },
      { status: 500 }
    );
  }
}
