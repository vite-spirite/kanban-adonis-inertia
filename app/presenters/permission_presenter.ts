import RolePermission from '#models/role_permission'
import type { PermissionDto } from '#types/permission.dto'

export class PermissionPresenter {
    declare id: number
    declare name: string
    declare allow: boolean
    declare createdAt: string
    declare updatedAt: string

    constructor(permission: RolePermission) {
        this.id = permission.id
        this.name = permission.permission
        this.allow = permission.allow
        this.createdAt = permission.createdAt.toISO() || ''
        this.updatedAt = permission.updatedAt.toISO() || ''
    }

    present(): PermissionDto {
        return {
            id: this.id,
            name: this.name,
            allow: this.allow,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}
