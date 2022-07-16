import { Database, SQLQueryBindings } from 'bun:sqlite'
import { pascalToSnake } from '../utils'

const db = new Database('db/mydb.sqlite', { create: true })
/**
 * Selects all rows from the given table.
 *
 * @template T
 * @param {string} type
 * @param {(string | undefined)} query
 * @param {SQLQueryBindings[]} [values=[]]
 * @return {*}  {Promise<T[]>}
 */
const select = <T>(
  type: string,
  query: string | undefined,
  values: SQLQueryBindings[] = []
): Promise<T[]> => {
  let sqlQuery = `SELECT * FROM ${type}`
  if (query) {
    sqlQuery += ` ${query}`
  }
  return new Promise<T[]>((resolve, reject) => {
    try {
      const stmt = db.prepare<SQLQueryBindings>(sqlQuery)
      const result = stmt.all(...values) as T[]
      if (result) {
        resolve(result)
      }
      throw new Error('No result found')
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Select one row from the given table.
 *
 * @template T
 * @param {string} type
 * @param {string} query
 * @param {SQLQueryBindings[]} values
  const type = value.constructor.name
 * @return {*}  {Promise<T>}
 */
const selectOne = <T>(
  type: string,
  query: string,
  values: SQLQueryBindings[]
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    try {
      const stmt = db.prepare(`SELECT * FROM ${type} WHERE ${query}`)
      const result = stmt.get(...values)

      if (result) {
        resolve(result)
      }
      throw new Error('No result found')
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Inserts a new row into the given table.
 *
 * @template T
 * @param {string} type
 * @param {string[]} keys
 * @param {SQLQueryBindings[]} values
 * @return {*}  {Promise<T>}
 */
const insert = async <T>(
  type: string,
  keys: string[],
  values: SQLQueryBindings[]
): Promise<T> => {
  const query = `INSERT INTO ${type} (${keys
    .map((k) => pascalToSnake(k))
    .join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`

  return promiseRun(query, values).then(() =>
    selectOne<T>(type, 'id = last_insert_rowid()', [])
  )
}

/**
 * Inserts a new row into the given table with the given data.
 *
 * @template T
 * @param {unknown} value
 * @return {*}  {Promise<T>}
 */
const insertData = async <T>(type: string, value: any): Promise<T> => {
  const keys = Object.keys(value)
  const values: SQLQueryBindings[] = Object.values(value)
  return insert<T>(type, keys, values)
}

/**
 * Updates the given row in the given table.
 *
 * @template T
 * @param {string} type
 * @param {SQLQueryBindings} id
 * @param {string[]} keys
 * @param {SQLQueryBindings[]} values
 * @return {*}  {Promise<T>}
 */
const update = async <T>(
  type: string,
  id: SQLQueryBindings,
  keys: string[],
  values: SQLQueryBindings[]
): Promise<T> => {
  const query = `UPDATE ${type} SET ${keys
    .map((k) => pascalToSnake(k))
    .map((key) => `${key} = ?`)
    .join(',')} WHERE id = ?`

  return promiseRun(query, [...values, id]).then(() =>
    selectOne<T>(type, 'id = last_insert_rowid()', [])
  )
}

/**
 * Updates the given row in the given table with the given data.
 *
 * @template T
 * @param {SQLQueryBindings} id
 * @param {unknown} value
 * @return {*}  {Promise<T>}
 */
const updateData = async <T>(
  id: SQLQueryBindings,
  type: string,
  value: any
): Promise<T> => {
  const keys = Object.keys(value)
  const values: SQLQueryBindings[] = Object.values(value)
  return update<T>(type, id, keys, values)
}

/**
 * Deletes the given row from the given table.
 *
 * @template T
 * @param {string} type
 * @param {SQLQueryBindings} id
 * @return {*}  {Promise<T>}
 */
const deleteOne = async <T>(type: string, id: SQLQueryBindings): Promise<T> => {
  const query = `DELETE FROM ${type} WHERE id = ?`

  const deleted = selectOne<T>(type, 'id = last_insert_rowid()', [])
  return promiseRun(query, [id]).then(() => deleted)
}

/**
 * Runs the given query.
 *
 * @param {string} query
 * @param {SQLQueryBindings[]} [values=[]]
 * @return {*} {Promise<void>}
 */
const promiseRun = (query: string, values: SQLQueryBindings[] = []) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const stmt = db.prepare(query)
      stmt.run(...values)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export default db
export { select, selectOne, insert, insertData, update, updateData, deleteOne }
