import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export async function GET() {
  try {
    const redis = Redis.fromEnv();
    
    // Obtener estadísticas del Redis
    const totalMessages = await redis.get('stats:total_messages') || 0;
    const activeUsers = await redis.get('stats:active_users') || 0;
    
    return NextResponse.json({
      totalMessages: Number(totalMessages),
      activeUsers: Number(activeUsers),
      modelsUsed: 11, // Los 11 modelos que tienes configurados
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
