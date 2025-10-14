import { NextRequest, NextResponse } from 'next/server';
import { connectDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDatabase();
    
    return NextResponse.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: Date.now(),
        environment: process.env.NODE_ENV || 'development',
      },
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Health check failed',
        data: {
          status: 'unhealthy',
          timestamp: Date.now(),
        },
      },
      { status: 500 }
    );
  }
}
