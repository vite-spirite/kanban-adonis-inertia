import type { MinimalProjectDto, ProjectEditDto } from '#types/project.dto'

import User from '#models/user'
import Project from '#models/project'
import RolePermission from '#models/role_permission'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import encryption from '@adonisjs/core/services/encryption'
import ProjectInvite from '#models/project_invite'
import ProjectTag from '#models/project_tag'
import ProjectTagPolicy from '#policies/project_tag_policy'

export class ProjectService {
    /**
     * Get all projects
     */
    async getAll(): Promise<Project[]> {
        return Project.query()
    }

    /**
     * Helper method to get user roles for a project
     */
    private async getUserRoles(user: User, projectId?: number) {
        const query = user.related('roles').query()

        if (projectId !== undefined) {
            query.where('projectId', projectId)
        }

        return query
    }

    /**
     * Get projects for a specific user
     */
    async getUserProject(user: User): Promise<Project[]> {
        const userRoles = await this.getUserRoles(user)

        return Project.query().whereIn(
            'id',
            userRoles.map((role) => role.projectId)
        )
    }

    /**
     * Get minimal project information for a user
     */
    async getMinimalUserProjects(user: User): Promise<MinimalProjectDto[]> {
        const userRoles = await this.getUserRoles(user)

        return Project.query()
            .select('id', 'name', 'image')
            .whereIn(
                'id',
                userRoles.map((role) => role.projectId)
            )
    }

    /**
     * Find a project by ID with related data
     */
    async findById(id: number): Promise<Project> {
        return Project.query()
            .preload('roles', (query) => query.preload('permissions').preload('users'))
            .preload('invites', (q) => q.preload('user'))
            .preload('categories', (q) => q.orderBy('order', 'asc'))
            .preload('tags')
            .where('id', id)
            .firstOrFail()
    }

    /**
     * Find permissions for a user in a specific project
     */
    async findPermissionByUser(user: User, project: Project): Promise<RolePermission[]> {
        const userRole = await this.getUserRoles(user, project.id)

        return RolePermission.query().whereIn(
            'roleId',
            userRole.map((role) => role.id)
        )
    }

    /**
     * Handle image upload and cleanup
     */
    private async handleImageUpload(project: Project, image: any): Promise<string | undefined> {
        if (!image) return undefined

        // Generate new image path
        const key = `projects/icons/${cuid()}.${image.extname}`
        await image.moveToDisk(key)

        // Delete old image if exists
        if (project.image) {
            const disk = drive.use('fs')
            const currentKey = project.image.replace('/uploads/', '/')
            await disk.delete(currentKey)
        }

        return image.meta.url
    }

    /**
     * Update project information
     */
    async update(project: Project, payload: ProjectEditDto): Promise<Project> {
        const imageUrl = await this.handleImageUpload(project, payload.image)

        project.merge({
            ...payload,
            image: imageUrl,
        })

        await project.save()
        return project
    }

    /**
     * Extract role IDs from available and allowed roles
     */
    private filterAllowedRoles(
        projectRoles: any[],
        rolePayload: { id: number; allow: boolean }[]
    ): number[] {
        const availableRoles = rolePayload.filter((role) =>
            projectRoles.find((r) => r.id === role.id && r.editable)
        )

        return availableRoles.filter((role) => role.allow).map((role) => role.id)
    }

    /**
     * Update user roles for a project
     */
    async updateUserRoles(
        project: Project,
        user: User,
        payload: { id: number; allow: boolean }[]
    ): Promise<void> {
        const projectRoles = project.roles ?? (await project.related('roles').query())
        const projectRoleIds = projectRoles.filter((r) => r.editable).map((role) => role.id)

        const allowedRoleIds = this.filterAllowedRoles(projectRoles, payload)

        // Detach all project roles and attach allowed ones
        await user.related('roles').detach(projectRoleIds)
        await user.related('roles').attach(allowedRoleIds)
    }

    async createInvite(project: Project, payload: any, user?: User): Promise<ProjectInvite> {
        const hashed = encryption.encrypt({
            project: project.id,
            roles: payload.roles,
        })

        return ProjectInvite.create({
            email: payload.email,
            token: hashed,
            projectId: project.id,
            userId: user?.id,
        })
    }

    async findInviteByToken(token: string): Promise<ProjectInvite | null> {
        return ProjectInvite.query().where('token', token).first()
    }

    async createTag(
        project: Project,
        payload: { name: string; color: string }
    ): Promise<ProjectTag> {
        return await project.related('tags').create(payload)
    }

    async editTag(tag: ProjectTag, payload: { name: string; color: string }): Promise<ProjectTag> {
        console.log(tag)
        return tag.merge(payload).save()
    }
}
