import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

const KEY_NAME = 'OPENAI_API_KEY';
const cache = globalThis as typeof globalThis & {
  __tutorbuddyOpenAI?: { loaded: boolean; value: string };
};

export function maskOpenAIKey(value: string) {
  const clean = value.trim();
  if (!clean) return '';
  if (clean.length <= 8) return `${clean.slice(0, 2)}…`;
  return `${clean.slice(0, 8)}…`;
}

export function invalidateOpenAIKey() {
  cache.__tutorbuddyOpenAI = { loaded: false, value: '' };
}

export async function getOpenAIKey() {
  if (cache.__tutorbuddyOpenAI?.loaded) return cache.__tutorbuddyOpenAI.value;
  const row = await prisma.appSecret.findUnique({ where: { key: KEY_NAME } });
  const saved = row?.value?.trim() || '';
  const value = saved || process.env.OPENAI_API_KEY?.trim() || '';
  cache.__tutorbuddyOpenAI = { loaded: true, value };
  return value;
}

export async function describeOpenAIKey() {
  const row = await prisma.appSecret.findUnique({ where: { key: KEY_NAME } });
  const saved = row?.value?.trim() || '';
  const envValue = process.env.OPENAI_API_KEY?.trim() || '';
  const active = saved || envValue;
  return {
    configured: Boolean(active),
    prefix: maskOpenAIKey(active),
    source: saved ? 'settings' : envValue ? 'environment' : 'missing',
  };
}

export async function replaceOpenAIKey(value: string) {
  const next = value.trim();
  if (next.length < 8) {
    const error = new Error('Enter the full replacement key');
    (error as Error & { status?: number }).status = 400;
    throw error;
  }
  await prisma.appSecret.upsert({
    where: { key: KEY_NAME },
    create: { key: KEY_NAME, value: next },
    update: { value: next },
  });
  invalidateOpenAIKey();
}

export async function createOpenAI() {
  const apiKey = await getOpenAIKey();
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}
