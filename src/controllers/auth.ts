import { Context } from 'hono'
import { generate, verify } from 'password-hash'

import { createToken, verifyToken } from '../services/auth'
import { createUser, getUserByCriteria } from '../services/users'
import type { Login } from '../types/Login'
import type { Register } from '../types/Register'
import HttpStatusCode from '../types/StatusCode'
import { handleError } from '../utils'

/**
 * Logs in a user.
 *
 * @param {Context} c
 */
const login = async (c: Context) => {
  return c.req
    .json<Login>()
    .then((body) =>
      getUserByCriteria(body)
        .then(async (user) => {
          return { user, res: await verify(body.password, user.password) }
        })
        .then(({ user, res }) => {
          if (res === false) {
            throw new Error('Login failed')
          }
          return createToken(user).then((token) => {
            c.header('Authorization', 'Bearer ' + token)
            return c.json(
              {
                message: 'Login successful',
                token
              },
              HttpStatusCode.OK
            )
          })
        })
    )
    .catch((err: Error) => handleError(c, err))
}

/**
 * Registers a new user.
 *
 * @param {Context} c
 */
const register = async (c: Context) => {
  return c.req
    .json<Register>()
    .then((body) => {
      const hashedPassword = generate(body.password, {
        algorithm: 'sha256',
        saltLength: 16
      })
      return createUser({ ...body, password: hashedPassword }).then((user) =>
        c.json(
          {
            message: 'User created',
            id: user.id
          },
          HttpStatusCode.CREATED
        )
      )
    })
    .catch((err: Error) => handleError(c, err))
}

/**
 * Verifies the JWT token and returns the user if it is valid.
 *
 * @param {Context} c
 */
const isLogged = async (c: Context) => {
  const header = c.req.header('Authorization')
  if (!header || !header.startsWith('Bearer ')) {
    return handleError(c, new Error('No token provided'))
  }
  const token = header.split(' ')[1]
  if (!token) {
    return handleError(c, new Error('Invalid token'))
  }

  return verifyToken(token)
    .then(() => c.json({ message: 'Token is valid' }, HttpStatusCode.OK))
    .catch((err: Error) => handleError(c, err))
}

export { login, register, isLogged }
