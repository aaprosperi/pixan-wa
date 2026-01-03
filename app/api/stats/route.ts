import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Obtener estadísticas del KV store
    const totalMessages = await kv.get('stats:total_messages') || 0;
    const activeUsers = await kv.get('stats:active_users') || 0;
    
    return NextResponse.json({
      totalMessages,
      activeUsers,
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
