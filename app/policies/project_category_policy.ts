import { BasePolicy } from '@adonisjs/bouncer'
import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'
import User from '#models/user'
import RolePermission from '#models/role_permission'
import Project from '#models/project'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { Permissions } from '#abilities/main'

@inject()
export default class ProjectCategoryPolicy extends BasePolicy {
    constructor(private readonly projectService: ProjectService) {
        super()
    }

    private async getUserCapabilities(user: User, project: Project): Promise<RolePermission[]> {
        return this.projectService.findPermissionByUser(user, project)
    }

    async move(user: User, project: Project): Promise<AuthorizerResponse> {
        const capabilities = await this.getUserCapabilities(user, project)
        return !!capabilities.find(
            (perm) => perm.permission === Permissions.PROJECT_CATEGORY_ORDER && perm.allow
        )
    }

    async edit(user: User, project: Project): Promise<AuthorizerResponse> {
        const capabilities = await this.getUserCapabilities(user, project)
        return !!capabilities.find(
            (perm) => perm.permission === Permissions.PROJECT_CATEGORY_EDIT && perm.allow
        )
    }

    async delete(user: User, project: Project): Promise<AuthorizerResponse> {
        const capabilities = await this.getUserCapabilities(user, project)
        return !!capabilities.find(
            (perm) => perm.permission === Permissions.PROJECT_CATEGORY_DELETE && perm.allow
        )
    }
}
