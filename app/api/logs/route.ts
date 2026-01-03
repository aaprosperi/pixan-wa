import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Obtener logs del KV store
    const logs = await kv.lrange('logs', 0, limit - 1);

    return NextResponse.json({
      logs: logs || [],
      count: logs?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await kv.del('logs');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting logs:', error);
    return NextResponse.json(
      { error: 'Failed to delete logs' },
      { status: 500 }
    );
  }
}
