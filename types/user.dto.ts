import type { InviteDto } from '#types/invite.dto'

export type UserDto = {
    id: number
    fullName: string
    createdAt: string
    updatedAt: string
}

export type MeDto = {
    id: number
    fullName: string
    email: string
    createdAt: string
    updatedAt: string
    invites: InviteDto[]
}
