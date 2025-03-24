import type User from '#models/user.js'

export type UserPresenter = Pick<User, 'id' | 'fullName' | 'email' | 'createdAt' | 'updatedAt'>
