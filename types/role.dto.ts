import { PermissionDto } from '#types/permission.dto'
import type { UserDto } from '#types/user.dto'

export type RoleDto = {
    id: number
    name: string
    editable: boolean
    createdAt: string
    updatedAt: string
    permissions?: PermissionDto[]
    users?: UserDto[]
}

export type RoleCreateDto = {
    name: string
}
