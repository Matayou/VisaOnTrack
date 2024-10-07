import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface TokenPayload {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export function signJwtAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1w', // Token expires in 1 week
  })
}

export function verifyJwt(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}