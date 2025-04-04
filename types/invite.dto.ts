import { UserDto } from '#types/user.dto'

export type InviteDto = {
    id: number
    name: string
    email: string
    token: string
    user?: UserDto
    projectId: number
    roles: { id: number; allow: boolean }[]
}
