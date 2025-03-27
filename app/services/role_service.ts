import { RoleCreateDto } from '#types/role.dto'
import Project from '#models/project'
import Role from '#models/project_role'
import RolePermission from '#models/role_permission'
import { Permissions } from '#abilities/main'

export class RoleService {
    async create(project: Project, payload: RoleCreateDto): Promise<Role> {
        const role = new Role()
        role.name = payload.name
        await project.related('roles').save(role)

        await RolePermission.createMany(
            Object.values(Permissions).map((permission) => {
                return {
                    roleId: role.id,
                    permission,
                }
            })
        )

        return role
    }

    async updateRolePermissions(
        role: Role,
        permissions: { name: string; allow: boolean }[]
    ): Promise<RolePermission[]> {
        return RolePermission.updateOrCreateMany(
            ['permission', 'roleId'],
            permissions.map((perm) => ({
                permission: perm.name,
                allow: perm.allow,
                roleId: role.id,
            }))
        )
    }
}
