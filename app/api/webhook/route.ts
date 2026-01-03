import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const redis = Redis.fromEnv();

// AI Gateway config (solo para modelos no-Gemini)
const AI_GATEWAY_API_KEY = process.env.AI_GATEWAY_API_KEY;
const AI_GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/chat/completions';

// Gemini API directa (default - GRATIS)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Configuración de memoria
const RECENT_MESSAGES_LIMIT = 20;
const SUMMARIZE_THRESHOLD = 30;
const MEMORY_EXPIRATION = 31536000; // 12 meses

// Modelos disponibles (mismo config que antes)
const MODELS = {
  'gemini': { provider: 'google-direct', model: 'gemini-3-flash-preview', apiVersion: 'v1beta', vision: true },
  'gemini-pro': { provider: 'google-direct', model: 'gemini-3-pro-preview', apiVersion: 'v1beta', vision: true },
  'gemini2': { provider: 'google-direct', model: 'gemini-2.0-flash', apiVersion: 'v1beta', vision: true },
  'opus': { provider: 'ai-gateway', model: 'anthropic/claude-opus-4-20250514', vision: true },
  'sonnet': { provider: 'ai-gateway', model: 'anthropic/claude-sonnet-4-20250514', vision: true },
  'claude': { provider: 'ai-gateway', model: 'anthropic/claude-sonnet-4-20250514', vision: true },
  'gpt': { provider: 'ai-gateway', model: 'openai/gpt-5.2', vision: true },
  'gpt5': { provider: 'ai-gateway', model: 'openai/gpt-5.2', vision: true },
  'gemini25': { provider: 'ai-gateway', model: 'google/gemini-2.5-flash', vision: true },
  'deepseek': { provider: 'ai-gateway', model: 'deepseek/deepseek-v3.2', vision: false },
  'grok': { provider: 'ai-gateway', model: 'x-ai/grok-4.1', vision: false },
};

const DEFAULT_MODEL = 'gemini';

// Helper: Incrementar uso de Upstash
async function trackUpstashUsage() {
  const today = new Date().toISOString().split('T')[0];
  const usageKey = `upstash:usage:${today}`;
  await redis.incr(usageKey);
  await redis.expire(usageKey, 86400); // 24 horas
}

// Helper: Guardar log
async function saveLog(from: string, message: string, model: string, response: string, status: 'success' | 'error') {
  try {
    const logEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      from,
      message: typeof message === 'string' ? message : '[imagen]',
      model,
      response,
      status,
    };
    
    await redis.lpush('logs', JSON.stringify(logEntry));
    await redis.ltrim('logs', 0, 999); // Mantener últimos 1000 logs
    await trackUpstashUsage();
  } catch (error) {
    console.error('Error saving log:', error);
  }
}

// Helper: Actualizar stats
async function updateStats(userId: string) {
  try {
    // Incrementar total de mensajes
    await redis.incr('stats:total_messages');
    
    // Agregar usuario a set de activos
    await redis.sadd('stats:active_users_set', userId);
    
    // Actualizar contador de usuarios activos
    const activeCount = await redis.scard('stats:active_users_set');
    await redis.set('stats:active_users', activeCount);
    
    await trackUpstashUsage();
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

// [... resto de funciones helper del webhook original ...]

async function saveRecentMessages(userId: string, messages: any[]) {
  try {
    const limitedMessages = messages.slice(-RECENT_MESSAGES_LIMIT);
    await redis.set(`recent:${userId}`, JSON.stringify(limitedMessages));
    await redis.expire(`recent:${userId}`, MEMORY_EXPIRATION);
    await trackUpstashUsage();
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

async function getRecentMessages(userId: string) {
  try {
    const messages = await redis.get(`recent:${userId}`);
    await trackUpstashUsage();
    return messages ? JSON.parse(messages as string) : [];
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
}

async function getUserModel(userId: string) {
  try {
    const model = await redis.get(`model:${userId}`);
    await trackUpstashUsage();
    return (model as string) || DEFAULT_MODEL;
  } catch (error) {
    return DEFAULT_MODEL;
  }
}

async function setUserModel(userId: string, model: string) {
  try {
    await redis.set(`model:${userId}`, model);
    await redis.expire(`model:${userId}`, MEMORY_EXPIRATION);
    await trackUpstashUsage();
  } catch (error) {
    console.error('Error setting model:', error);
  }
}

// [Continúa en siguiente mensaje...]
