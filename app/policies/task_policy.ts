import User from '#models/user'
import Task from '#models/task'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { ProjectService } from '#services/project_service'
import Project from '#models/project'
import RolePermission from '#models/role_permission'
import { inject } from '@adonisjs/core'
import { Permissions } from '#abilities/main'

@inject()
export default class TaskPolicy extends BasePolicy {
    constructor(private readonly projectService: ProjectService) {
        super()
    }

    private async getUserCapabilities(user: User, project: Project): Promise<RolePermission[]> {
        return this.projectService.findPermissionByUser(user, project)
    }

    async order(user: User, project: Project): Promise<AuthorizerResponse> {
        const capabilities = await this.getUserCapabilities(user, project)

        return !!capabilities.find(
            (perm) => perm.permission === Permissions.PROJECT_TASK_ORDER && perm.allow
        )
    }

    async create(user: User, project: Project): Promise<AuthorizerResponse> {
        const capabilities = await this.getUserCapabilities(user, project)
        return !!capabilities.find(
            (perm) => perm.permission === Permissions.PROJECT_TASK_CREATE && perm.allow
        )
    }
}
