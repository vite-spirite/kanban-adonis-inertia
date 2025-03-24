import type Project from '#models/project'
import type { RoleDto } from '#types/role.dto'

export type MinimalProject = Pick<Project, 'id' | 'name' | 'image'>

export type ProjectDto = {
    id: number
    name: string
    image?: string
    createdAt: string
    updatedAt: string
    roles?: RoleDto[]
}
