import type Project from '#models/project'
import type { RoleDto } from '#types/role.dto'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import type { UserDto } from '#types/user.dto'
import type { InviteDto } from '#types/invite.dto'

export type MinimalProjectDto = Pick<Project, 'id' | 'name' | 'image'>

export type ProjectDto = {
    id: number
    name: string
    image?: string
    createdAt: string
    updatedAt: string
    roles?: RoleDto[]
    users?: UserDto[]
    invites?: InviteDto[]
}

export type ProjectEditDto = {
    name: string
    image?: MultipartFile
}
