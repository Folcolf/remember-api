import { deleteOne, insert, select, selectOne, update } from '../db'
import type { Note } from '../types/model/Note'
import type { Pagination } from '../types/Pagination'

/**
 * Get all notes for a user
 *
 * @param {string} userId
 * @param {Pagination} { page, limit }
 * @return {*}  {Promise<Note[]>}
 */
const findNotesForUser = async (
  userId: string,
  { page, limit }: Pagination
): Promise<Note[]> => {
  return select<Note>('note', 'userId = $1 LIMIT $2 OFFSET $3', [
    userId,
    limit,
    page * limit
  ])
}

/**
 * Get note by id
 *
 * @param {string} id
 * @return {*}  {Promise<Note>}
 */
const findNoteById = async (id: string): Promise<Note> => {
  return selectOne<Note>('note', 'id = $1', [id])
}

/**
 * Create note
 *
 * @param {Note} note
 * @return {*}  {Promise<Note>}
 */
const createNote = async (note: Note): Promise<Note> => {
  return insert<Note>(
    'note',
    ['title', 'content', 'userId'],
    [note.title, note.content, note.userId]
  )
}

/**
 * Update note
 *
 * @param {Note} note
 * @return {*}  {Promise<Note>}
 */
const updateNote = async (note: Note): Promise<Note> => {
  return update<Note>('note', note.id, [], [note.title, note.content])
}

/**
 * Delete note
 *
 * @param {string} id
 * @return {*}  {Promise<Note>}
 */
const deleteNote = async (id: string): Promise<Note> => {
  return deleteOne<Note>('note', id)
}

export { findNotesForUser, findNoteById, createNote, updateNote, deleteNote }
