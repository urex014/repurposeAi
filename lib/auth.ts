// lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function getUserIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}