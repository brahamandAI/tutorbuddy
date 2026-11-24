import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function requireAdmin(request: Request) {
  const header = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|; )token=([^;]+)/);
  const token = header || (match ? decodeURIComponent(match[1]) : '');
  if (!token) return null;
  const decoded = verifyToken(token) as { userId?: string } | null;
  if (!decoded?.userId) return null;
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user?.isAdmin) return null;
  return user;
}
