import { PermissionDto } from '#types/permission.dto'
import type { UserDto } from '#types/user.dto'

export type RoleDto = {
    id: number
    name: string
    createdAt: string
    updatedAt: string
    permissions?: PermissionDto[]
    users?: UserDto[]
}
