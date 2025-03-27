import { BasePolicy } from '@adonisjs/bouncer'
import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { Permissions as PermissionsType } from '#abilities/main'
import Project from '#models/project'
import User from '#models/user'
import ProjectRole from '#models/project_role'

@inject()
export default class ProjectRolePolicy extends BasePolicy {
    constructor(private readonly projectService: ProjectService) {
        super()
    }

    async create(user: User, project: Project): Promise<AuthorizerResponse> {
        const permissions = await this.projectService.findPermissionByUser(user, project)

        return !!permissions.find(
            (perm) => perm.permission === PermissionsType.PROJECT_ROLE_CREATE && perm.allow
        )
    }

    async edit(user: User, project: Project, role: ProjectRole): Promise<AuthorizerResponse> {
        if (!role.editable) {
            return false
        }

        const permissions = await this.projectService.findPermissionByUser(user, project)

        return !!permissions.find(
            (perm) => perm.permission === PermissionsType.PROJECT_ROLE_EDIT && perm.allow
        )
    }

    async delete(user: User, project: Project, role: ProjectRole): Promise<AuthorizerResponse> {
        if (!role.editable) {
            return false
        }

        const permissions = await this.projectService.findPermissionByUser(user, project)
        return !!permissions.find(
            (perm) => perm.permission === PermissionsType.PROJECT_ROLE_DELETE && perm.allow
        )
    }
}
