import type { MinimalProject } from '#types/project.dto'

import User from '#models/user'
import Project from '#models/project'
import RolePermission from '#models/role_permission'

export class ProjectService {
    async getAll(): Promise<Project[]> {
        return Project.query()
    }

    async getUserProject(user: User): Promise<Project[]> {
        const userRoles = await user.related('roles').query()

        return Project.query().whereIn(
            'id',
            userRoles.map((role) => role.projectId)
        )
    }

    async getMinimalUserProjects(user: User): Promise<MinimalProject[]> {
        const userRoles = await user.related('roles').query()

        return Project.query()
            .select('id', 'name', 'image')
            .whereIn(
                'id',
                userRoles.map((role) => role.projectId)
            )
    }

    async findById(id: number): Promise<Project> {
        return Project.query()
            .preload('roles', (query) => query.preload('permissions').preload('users'))
            .where('id', id)
            .firstOrFail()
    }

    async findPermissionByUser(user: User, project: Project): Promise<RolePermission[]> {
        const userRole = await user.related('roles').query().where('projectId', project.id)

        const permissions = await RolePermission.query().whereIn(
            'roleId',
            userRole.map((role) => role.id)
        )

        return permissions
    }
}
