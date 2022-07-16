import type { Note } from './Note'
import type { Token } from './Token'

export type User = {
  id: string
  username: string
  email: string
  password: string

  notes: Note[]
  token: Token[]

  createdAt: string
  updatedAt: string
}
