import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/requireAdmin';
import { describeOpenAIKey, replaceOpenAIKey } from '@/lib/openaiKey';

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  return NextResponse.json(await describeOpenAIKey());
}

export async function PUT(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  try {
    const body = await request.json();
    await replaceOpenAIKey(String(body?.value || ''));
    return NextResponse.json({ ok: true, ...(await describeOpenAIKey()) });
  } catch (error) {
    const status = (error as { status?: number }).status || 500;
    return NextResponse.json(
      { error: status === 400 ? (error as Error).message : 'Could not save that key' },
      { status }
    );
  }
}
