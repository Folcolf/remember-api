import { SQLQueryBindings } from 'bun:sqlite'

import { deleteOne, insertData, select, selectOne, update } from '../db'
import type { Login } from '../types/Login'
import type { User } from '../types/model/User'
import type { Pagination } from '../types/Pagination'
import type { Register } from '../types/Register'

/**
 * Get all users
 *
 * @param {Pagination} { page, limit }
 * @return {*}  {Promise<User[]>}
 */
const getAllUsers = async ({ page, limit }: Pagination): Promise<User[]> => {
  return select<User>('user', 'LIMIT $1 OFFSET $2', [limit, page * limit])
}

/**
 * Get user by id
 *
 * @param {string} id
 * @return {*}  {Promise<User>}
 */
const getUserById = async (id: string): Promise<User> => {
  return selectOne<User>('user', 'id = $1', [id])
}

/**
 * Get user by criteria
 *
 * @param {User} user
 * @return {*}  {Promise<User>}
 */
const getUserByCriteria = async ({ username, email }: Login): Promise<User> => {
  let query = ''
  const values: SQLQueryBindings[] = []
  if (username) {
    query += 'username = ?'
    values.push(username)
  } else if (email) {
    query += 'email = ?'
    values.push(email)
  } else {
    throw new Error('No criteria provided')
  }

  return selectOne<User>('user', query, values)
}

/**
 * Create user
 *
 * @param {User} user
 * @return {*}  {Promise<User>}
 */
const createUser = async (user: Register): Promise<User> => {
  return insertData<User>('user', user)
}

/**
 * Update user
 *
 * @param {string} id
 * @param {User} user
 * @return {*}  {Promise<User>}
 */
const updateUser = async (id: string, user: User): Promise<User> => {
  return update<User>(
    'user',
    id,
    ['username', 'email', 'updatedAt'],
    [user.username, user.email, new Date().toISOString()]
  )
}

/**
 * Delete user
 *
 * @param {string} id
 * @return {*}  {Promise<User>}
 */
const deleteUser = async (id: string): Promise<User> => {
  return deleteOne<User>('user', id)
}

export {
  getAllUsers,
  getUserById,
  getUserByCriteria,
  createUser,
  updateUser,
  deleteUser
}
