import { RoleCreateDto } from '#types/role.dto'
import Project from '#models/project'
import Role from '#models/project_role'
import RolePermission from '#models/role_permission'
import { Permissions } from '#abilities/main'

export class RoleService {
    /**
     * Create a new role with default permissions
     * @param project The project to associate the role with
     * @param payload Role creation data
     * @returns Newly created role
     */
    async create(project: Project, payload: RoleCreateDto): Promise<Role> {
        // Create and associate the role with the project
        const role = new Role()
        role.name = payload.name
        await project.related('roles').save(role)

        // Create default permissions for the role
        await this.createDefaultPermissions(role.id)

        return role
    }

    /**
     * Create default permissions for a role
     * @param roleId The role ID to create permissions for
     * @returns Array of created permission records
     */
    private async createDefaultPermissions(roleId: number): Promise<RolePermission[]> {
        return RolePermission.createMany(
            Object.values(Permissions).map((permission) => ({
                roleId,
                permission,
                allow: false,
            }))
        )
    }

    /**
     * Update role permissions
     * @param role The role to update permissions for
     * @param permissions Array of permission objects with name and allow status
     * @returns Updated permission records
     */
    async updateRolePermissions(
        role: Role,
        permissions: { name: string; allow: boolean }[]
    ): Promise<RolePermission[]> {
        return RolePermission.updateOrCreateMany(
            ['permission', 'roleId'],
            this.mapPermissionsToRolePermissions(permissions, role.id)
        )
    }

    /**
     * Map permission objects to RolePermission properties
     * @param permissions Array of permission objects with name and allow status
     * @param roleId The role ID to associate permissions with
     * @returns Mapped permission objects ready for database operations
     */
    private mapPermissionsToRolePermissions(
        permissions: { name: string; allow: boolean }[],
        roleId: number
    ): { permission: string; allow: boolean; roleId: number }[] {
        return permissions.map((perm) => ({
            permission: perm.name,
            allow: perm.allow,
            roleId,
        }))
    }
}
