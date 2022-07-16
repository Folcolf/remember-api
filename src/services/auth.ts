import { sign, verify } from 'jsonwebtoken'
import type { User } from '../types/model/User'

const secret = process.env.JWT_SECRET
const MAX_AGE = 60 * 60 * 24

/**
 * Creates a new token for a user.
 *
 * @param {User} user
 * @return {*}  {Promise<string>}
 */
const createToken = async (user: User): Promise<string> => {
  const sub = new Date().getTime() / 1000
  const payload = { sub, id: user.id }

  if (secret === undefined) {
    throw new Error('JWT_SECRET is not defined')
  }

  return sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: MAX_AGE
  })
}

/**
 * Verifies a token and returns the result.
 *
 * @param {string} token
 * @return {*}  {Promise<JWTVerifyResult>}
 */
const verifyToken = async (token: string): Promise<string> => {
  if (secret === undefined) {
    throw new Error('JWT_SECRET is not defined')
  }
  const decoded = verify(token, secret, {
    algorithms: ['HS256']
  })

  if (decoded === undefined || typeof decoded === 'string') {
    throw new Error('Invalid token')
  }

  const time = new Date().getTime() / 1000
  return new Promise((resolve, reject) => {
    if (time - decoded.exp!! > 0) {
      reject(new Error('Token expired'))
    }
    resolve(token)
  })
}

export { createToken, verifyToken }
