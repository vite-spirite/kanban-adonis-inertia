import Role from '#models/project_role'
import type { RoleDto } from '#types/role.dto'
import { PermissionPresenter } from '#presenters/permission_presenter'
import { UserPresenter } from '#presenters/user_presenter'

export class RolePresenter {
    declare id: number
    declare name: string
    declare editable: boolean
    declare createdAt: string
    declare updatedAt: string

    declare permissions?: PermissionPresenter[]
    declare users?: UserPresenter[]

    constructor(role: Role) {
        this.id = role.id
        this.name = role.name
        this.editable = role.editable
        this.createdAt = role.createdAt.toISO() || ''
        this.updatedAt = role.updatedAt.toISO() || ''

        if (role.permissions) {
            this.permissions = role.permissions.map(
                (permission) => new PermissionPresenter(permission)
            )
        }

        if (role.users) {
            this.users = role.users.map((user) => new UserPresenter(user))
        }
    }

    present(): RoleDto {
        return {
            id: this.id,
            name: this.name,
            editable: this.editable,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            permissions: this.permissions?.map((permission) => permission.present()),
            users: this.users?.map((user) => user.present()),
        }
    }
}
