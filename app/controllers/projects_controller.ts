import { HttpContext } from '@adonisjs/core/http'
import ProjectPolicy from '#policies/project_policy'
import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'
import { ProjectCreateValidator, projectEdit } from '#validators/project'
import { RoleService } from '#services/role_service'
import { CreateRoleValidator, UpdateRoleValidator, UpdateUserRoleValidator } from '#validators/role'
import ProjectRolePolicy from '#policies/project_role_policy'
import { UserService } from '#services/user_service'
import { CreateInviteValidator } from '#validators/invite'
import encryption from '@adonisjs/core/services/encryption'
import transmit from '@adonisjs/transmit/services/main'
import { InvitePresenter } from '#presenters/invite_presenter'

@inject()
export default class ProjectsController {
    constructor(
        private readonly userService: UserService,
        private readonly projectService: ProjectService,
        private readonly roleService: RoleService
    ) {}

    async create({ request, auth, bouncer, response }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        if (await bouncer.with(ProjectPolicy).denies('create')) {
            return response.redirect().back()
        }

        const payload = await request.validateUsing(ProjectCreateValidator)

        const project = await this.projectService.create(payload)
        const adminRole = await this.roleService.createAdminRole(project)

        await adminRole.related('users').attach([auth.user.id])

        return response.redirect().toRoute('dashboard.project', { id: project.id })
    }

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

    async createInvite({ auth, bouncer, request, response, params }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(params.id)

        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(ProjectPolicy).denies('invite', project)) {
            return response.redirect().back()
        }

        const payload = await CreateInviteValidator.validate(request.all())
        const user = await this.userService.findByEmail(payload.email)

        const newInvite = await this.projectService.createInvite(
            project,
            payload,
            user ?? undefined
        )

        if (newInvite.userId) {
            console.log(newInvite.userId)
            transmit.broadcast(`/user/${newInvite.userId}/invites`, {
                type: 'add',
                invite: new InvitePresenter(newInvite).present(),
            })
        }

        return response.redirect().back()
    }

    async acceptInvite({ request, response, params, auth }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const invite = await this.projectService.findInviteByToken(params.token)

        if (!invite) {
            return response.redirect().back()
        }

        if (invite.userId !== auth.user.id) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(invite.projectId)

        if (!project) {
            return response.redirect().back()
        }

        const invitePayload = encryption.decrypt<{
            projectId: number
            roles: { id: number; allow: boolean }[]
        }>(invite.token)

        if (!invitePayload) {
            return response.redirect().back()
        }

        await this.projectService.updateUserRoles(project, auth.user, invitePayload.roles)

        await invite.delete()

        return response.redirect().toRoute('dashboard.index')
    }

    async removeInvite({ response, params, auth, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(params.id)

        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(ProjectPolicy).denies('deleteInvite', project)) {
            return response.redirect().back()
        }

        const invite = await project.related('invites').query().where('id', params.inviteId).first()
        if (!invite) {
            return response.redirect().back()
        }

        if (invite.userId) {
            transmit.broadcast(`/user/${invite.userId}/invites`, {
                type: 'delete',
                invite: new InvitePresenter(invite).present(),
            })
        }

        await invite.delete()
        return response.redirect().back()
    }
}
