import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { prisma } from './prisma';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  const token = jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '24h' }
  );
  return token;
}

export function verifyToken(token: string): any {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(req: NextRequest): Promise<{ user: User | null; error?: string }> {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return { user: null, error: 'No token provided' };
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return { user: null, error: 'Invalid token' };
    }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return { user: null, error: 'User not found' };
    }

    return { user };
  } catch (error) {
    return { user: null, error: 'Authentication failed' };
  }
}

export function withAuth(handler: Function) {
  return async (req: NextRequest) => {
    const { user, error } = await authenticateUser(req);
    
    if (error || !user) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    return handler(req, user);
  };
} 