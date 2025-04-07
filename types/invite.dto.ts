import type { UserDto } from '#types/user.dto'
import type { MinimalProjectDto } from '#types/project.dto'

export type InviteDto = {
    id: number
    email: string
    token: string
    user?: UserDto
    projectId: number
    roles: { id: number; allow: boolean }[]
    project?: MinimalProjectDto
    createdAt: string
}
