import { HttpContext } from '@adonisjs/core/http'
import ProjectPolicy from '#policies/project_policy'
import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'
import { projectEdit } from '#validators/project'
import { RoleService } from '#services/role_service'
import { CreateRoleValidator, UpdateRoleValidator, UpdateUserRoleValidator } from '#validators/role'
import ProjectRolePolicy from '#policies/project_role_policy'
import { UserService } from '#services/user_service'

@inject()
export default class ProjectsController {
    constructor(
        private readonly userService: UserService,
        private readonly projectService: ProjectService,
        private readonly roleService: RoleService
    ) {}

    async update({ request, auth, bouncer, params, response }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(params.id)

        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(ProjectPolicy).denies('edit', project)) {
            return response.redirect().back()
        }

        const payload = await request.validateUsing(projectEdit)
        await this.projectService.update(project, payload)

        return response.redirect().back()
    }

    async createRole({ request, params, auth, response, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const payload = await CreateRoleValidator.validate(request.all())
        const project = await this.projectService.findById(params.id)

        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(ProjectRolePolicy).denies('create', project)) {
            return response.redirect().back()
        }

        await this.roleService.create(project, payload)

        return response.redirect().back()
    }

    async updateRolePermission({ request, params, auth, response, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(params.id)

        if (!project) {
            return response.redirect().back()
        }

        const role = project.roles.find((r) => r.id === +params.roleId)

        if (!role) {
            return response.redirect().back()
        }

        if (await bouncer.with(ProjectRolePolicy).denies('edit', project, role)) {
            return response.redirect().back()
        }

        const payload = await UpdateRoleValidator.validate(request.all())
        await this.roleService.updateRolePermissions(role, payload.permissions)

        return response.redirect().back()
    }

    async deleteRole({ params, auth, response, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(params.id)

        if (!project) {
            return response.redirect().back()
        }

        const role = project.roles.find((r) => r.id === +params.roleId)

        if (!role) {
            return response.redirect().back()
        }

        if (await bouncer.with(ProjectRolePolicy).denies('delete', project, role)) {
            return response.redirect().back()
        }

        await role.related('users').detach()
        await role.delete()

        return response.redirect().back()
    }

    async updateUserRoles({ request, auth, bouncer, params, response }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const payload = await UpdateUserRoleValidator.validate(request.all())
        console.log(payload)

        const project = await this.projectService.findById(params.id)

        if (!project) {
            return response.redirect().back()
        }

        const user = await this.userService.findById(payload.user_id)

        if (!user) {
            return response.redirect().back()
        }

        if (await bouncer.with(ProjectPolicy).denies('updateMemberRoles', project)) {
            return response.redirect().back()
        }

        await this.projectService.updateUserRoles(project, user, payload.roles)
        return response.redirect().back()
    }
}
