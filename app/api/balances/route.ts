import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export async function GET() {
  try {
    const balances = {
      aiGateway: await checkAIGatewayBalance(),
      twilio: await checkTwilioBalance(),
      gemini: await checkGeminiQuota(),
      upstash: await checkUpstashUsage(),
    };

    return NextResponse.json(balances);
  } catch (error) {
    console.error('Error fetching balances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balances' },
      { status: 500 }
    );
  }
}

async function checkAIGatewayBalance() {
  try {
    // TODO: Implementar llamada real a AI Gateway API
    // Por ahora retornamos datos mock
    return {
      status: 'ok',
      balance: 15.50,
      currency: 'USD',
    };
  } catch (error) {
    return {
      status: 'error',
      balance: 0,
      currency: 'USD',
    };
  }
}

async function checkTwilioBalance() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error('Missing Twilio credentials');
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Balance.json`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Twilio balance');
    }

    const data = await response.json();
    const balance = parseFloat(data.balance);

    return {
      status: balance > 5 ? 'ok' : balance > 1 ? 'warning' : 'error',
      balance: Math.abs(balance),
      currency: data.currency,
    };
  } catch (error) {
    console.error('Twilio balance error:', error);
    return {
      status: 'error',
      balance: 0,
      currency: 'USD',
    };
  }
}

async function checkGeminiQuota() {
  try {
    // Gemini es gratis, solo mostramos uso de quota
    // TODO: Implementar tracking real de requests
    return {
      status: 'ok',
      quotaUsed: 342,
      quotaLimit: 1500,
    };
  } catch (error) {
    return {
      status: 'error',
      quotaUsed: 0,
      quotaLimit: 1500,
    };
  }
}

async function checkUpstashUsage() {
  try {
    const redis = Redis.fromEnv();
    
    // Obtener el contador de comandos diarios
    const today = new Date().toISOString().split('T')[0];
    const usageKey = `upstash:usage:${today}`;
    const commandsUsed = await redis.get(usageKey) || 0;
    
    // Límite gratuito de Upstash: 10,000 comandos/día
    const dailyLimit = 10000;
    const usage = Number(commandsUsed);
    const percentUsed = (usage / dailyLimit) * 100;
    
    return {
      status: percentUsed < 70 ? 'ok' : percentUsed < 90 ? 'warning' : 'error',
      commandsUsed: usage,
      dailyLimit: dailyLimit,
      percentUsed: Math.round(percentUsed),
    };
  } catch (error) {
    console.error('Upstash usage error:', error);
    return {
      status: 'error',
      commandsUsed: 0,
      dailyLimit: 10000,
      percentUsed: 0,
    };
  }
}
