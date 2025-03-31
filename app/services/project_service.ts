import type { MinimalProjectDto, ProjectEditDto } from '#types/project.dto'

import User from '#models/user'
import Project from '#models/project'
import RolePermission from '#models/role_permission'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'

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

    async getMinimalUserProjects(user: User): Promise<MinimalProjectDto[]> {
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

    async update(project: Project, payload: ProjectEditDto): Promise<Project> {
        if (payload.image) {
            const key = `projects/icons/${cuid()}.${payload.image.extname}`

            await payload.image.moveToDisk(key)

            if (project.image) {
                const disk = drive.use('fs')
                const currentKey = project.image.replace('/uploads/', '/')

                await disk.delete(currentKey)
            }
        }

        project.merge({
            ...payload,
            image: payload.image ? payload.image.meta.url : project.image,
        })

        await project.save()

        return project
    }

    async updateUserRoles(
        project: Project,
        user: User,
        payload: { id: number; allow: boolean }[]
    ): Promise<void> {
        const projectRoles = project.roles ?? (await project.related('roles').query())

        const availableRoles = payload.filter((role) => projectRoles.find((r) => r.id === role.id))
        const attachedRoles = availableRoles.filter((role) => role.allow).map((role) => role.id)

        await user.related('roles').detach(projectRoles.map((role) => role.id))
        await user.related('roles').attach(attachedRoles)
    }
}
