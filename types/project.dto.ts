import type Project from '#models/project'
import type { RoleDto } from '#types/role.dto'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export type MinimalProjectDto = Pick<Project, 'id' | 'name' | 'image'>

export type ProjectDto = {
    id: number
    name: string
    image?: string
    createdAt: string
    updatedAt: string
    roles?: RoleDto[]
}

export type ProjectEditDto = {
    name: string
    image?: MultipartFile
}
