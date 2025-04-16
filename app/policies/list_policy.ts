import User from '#models/user'
import List from '#models/list'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import Project from '#models/project'
import RolePermission from '#models/role_permission'
import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'
import { Permissions } from '#abilities/main'

@inject()
export default class ListPolicy extends BasePolicy {
    constructor(private readonly projectService: ProjectService) {
        super()
    }

    private async getUserCapabilities(user: User, project: Project): Promise<RolePermission[]> {
        return this.projectService.findPermissionByUser(user, project)
    }

    async create(user: User, project: Project): Promise<AuthorizerResponse> {
        const capabilities = await this.getUserCapabilities(user, project)
        return !!capabilities.find(
            (perm) => perm.permission === Permissions.PROJECT_TASK_LIST_CREATE && perm.allow
        )
    }

    async update(user: User, project: Project): Promise<AuthorizerResponse> {
        const capabilities = await this.getUserCapabilities(user, project)
        return !!capabilities.find(
            (perm) => perm.permission === Permissions.PROJECT_TASK_LIST_EDIT && perm.allow
        )
    }

    async delete(user: User, project: Project): Promise<AuthorizerResponse> {
        const capabilities = await this.getUserCapabilities(user, project)
        return !!capabilities.find(
            (perm) => perm.permission === Permissions.PROJECT_TASK_LIST_DELETE && perm.allow
        )
    }

    async check(user: User, project: Project): Promise<AuthorizerResponse> {
        const capabilities = await this.getUserCapabilities(user, project)
        return !!capabilities.find(
            (perm) => perm.permission === Permissions.PROJECT_TASK_LIST_CHECK && perm.allow
        )
    }
}
