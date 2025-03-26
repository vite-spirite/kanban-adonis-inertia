import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import Project from '#models/project'
import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'

import { Permissions as PermissionsType } from '#abilities/main'

@inject()
export default class ProjectPolicy extends BasePolicy {
    constructor(private readonly projectService: ProjectService) {
        super()
    }

    create(_: User): AuthorizerResponse {
        return true
    }

    async read(user: User, project: Project): Promise<AuthorizerResponse> {
        const permissions = await this.projectService.findPermissionByUser(user, project)

        return !!permissions.find(
            (perm) => perm.permission === PermissionsType.PROJECT_READ && perm.allow
        )
    }

    async edit(user: User, project: Project): Promise<AuthorizerResponse> {
        const permissions = await this.projectService.findPermissionByUser(user, project)

        return !!permissions.find(
            (perm) => perm.permission === PermissionsType.PROJECT_EDIT && perm.allow
        )
    }

    async delete(user: User, project: Project): Promise<AuthorizerResponse> {
        const permissions = await this.projectService.findPermissionByUser(user, project)

        return !!permissions.find(
            (perm) => perm.permission === PermissionsType.PROJECT_DELETE && perm.allow
        )
    }
}
