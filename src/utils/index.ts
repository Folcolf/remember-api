import { Context } from 'hono'
import HttpStatusCode from '../types/StatusCode'

const pascalToSnake = (str: string) => {
  return str
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase()
}

const handleError = (c: Context, err: Error) => {
  const error = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)))
  error.stack = undefined
  console.log(error)

  return c.json({ message: 'Login failed', error }, HttpStatusCode.BAD_REQUEST)
}

export { pascalToSnake, handleError }
