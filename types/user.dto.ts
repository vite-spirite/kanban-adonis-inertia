import type User from '#models/user'

export type MeDto = Pick<User, 'id' | 'fullName' | 'email' | 'createdAt' | 'updatedAt'>

export type UserDto = {
    id: number
    fullName: string
    createdAt: string
    updatedAt: string
}
