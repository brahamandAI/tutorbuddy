import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      {
        expiresIn: '24h',
      },
      (err, token) => {
        if (err) reject(err);
        else resolve(token as string);
      }
    );
  });
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded as JWTPayload);
    });
  });
} 