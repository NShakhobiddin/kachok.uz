import { SignJWT, jwtVerify } from 'jose';

export interface AccessClaims {
  sub: string;
  role: 'athlete' | 'coach';
}

const key = (secret: string) => new TextEncoder().encode(secret);

export async function signAccess(secret: string, claims: AccessClaims, ttlSec = 15 * 60): Promise<string> {
  return new SignJWT({ role: claims.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + ttlSec)
    .setIssuer('kachok')
    .sign(key(secret));
}

export async function verifyAccess(secret: string, token: string): Promise<AccessClaims | null> {
  try {
    const { payload } = await jwtVerify(token, key(secret), { issuer: 'kachok', algorithms: ['HS256'] });
    if (!payload.sub) return null;
    return { sub: payload.sub, role: payload.role === 'coach' ? 'coach' : 'athlete' };
  } catch {
    return null;
  }
}
