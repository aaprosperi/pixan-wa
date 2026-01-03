import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const prompt = await kv.get('system_prompt') || '';
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error fetching system prompt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system prompt' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt' },
        { status: 400 }
      );
    }

    await kv.set('system_prompt', prompt);
    
    return NextResponse.json({ 
      success: true,
      prompt,
    });
  } catch (error) {
    console.error('Error saving system prompt:', error);
    return NextResponse.json(
      { error: 'Failed to save system prompt' },
      { status: 500 }
    );
  }
}
