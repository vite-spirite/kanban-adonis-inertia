import type Project from '#models/project'
import type { RoleDto } from '#types/role.dto'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import type { UserDto } from '#types/user.dto'
import type { InviteDto } from '#types/invite.dto'
import type { CategoryDto } from '#types/category.dto'
import type { TagDto } from '#types/tag.dto'

export type MinimalProjectDto = Pick<Project, 'id' | 'name' | 'image'>

export type ProjectDto = {
    id: number
    name: string
    image?: string
    public: boolean
    createdAt: string
    updatedAt: string
    roles?: RoleDto[]
    users?: UserDto[]
    invites?: InviteDto[]
    categories?: CategoryDto[]
    tags?: TagDto[]
}

export type ProjectEditDto = {
    name: string
    image?: MultipartFile
    public?: boolean
}
