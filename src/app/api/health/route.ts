import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  const start = Date.now();
  try {
    const mongoose = await connectDB();
    const readyState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const stateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const latencyMs = Date.now() - start;

    return NextResponse.json({
      success: true,
      status: readyState === 1 ? 'healthy' : 'degraded',
      database: {
        state: stateMap[readyState] || 'unknown',
        readyState,
        latencyMs,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        status: 'unhealthy',
        error: error.message || 'Database connection error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
