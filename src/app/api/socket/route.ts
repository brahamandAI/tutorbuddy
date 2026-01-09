import { NextResponse } from 'next/server';
import { getSocketIO } from '@/lib/socket';

export async function GET() {
  const io = getSocketIO();
  
  if (!io) {
    return new NextResponse('Socket.IO not initialized', { status: 500 });
  }

  return new NextResponse('Socket.IO server is running', { status: 200 });
}

// Required for Socket.IO
export const dynamic = 'force-dynamic'; 