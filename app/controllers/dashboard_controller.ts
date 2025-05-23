import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'
import { ProjectPresenter } from '#presenters/project_presenter'
import { PermissionPresenter } from '#presenters/permission_presenter'
import ProjectPolicy from '#policies/project_policy'
import { ProjectDto } from '#types/project.dto'
import { TaskService } from '#services/task_service'
import { TaskPresenter } from '#presenters/task_presenter'
import { ActivityService } from '#services/activity_service'
import { ActivityPresenter } from '#presenters/activity_presenter'

@inject()
export default class DashboardController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly taskService: TaskService,
        private readonly activityService: ActivityService
    ) {}

    async index({ inertia, auth, response }: HttpContext) {
        if (!auth.user) {
            return response.redirect().toRoute('login')
        }

        await this.projectService.getUserProject(auth.user)
        return inertia.render('dashboard/index')
    }

    async createProject({ inertia, auth, response, params, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().toRoute('login')
        }

        return inertia.render('dashboard/project/create')
    }

    async project({ inertia, auth, response, params, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().toRoute('login')
        }

        const project = await this.projectService.findById(params.id)

        if (!project || (await bouncer.with(ProjectPolicy).denies('read', project))) {
            return response.redirect().toRoute('home')
        }

        const presenter = new ProjectPresenter(project)

        const capabilities = await this.projectService.findPermissionByUser(auth.user, project)
        const capabilitiesPresenter = capabilities.map((capability) =>
            new PermissionPresenter(capability).present()
        )

        return inertia.render('dashboard/project', {
            project: presenter.present(),
            capabilities: capabilitiesPresenter,
        })
    }

    async edit({ inertia, auth, response, params, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().toRoute('login')
        }

        const project = await this.projectService.findById(params.id)

        if (!project || (await bouncer.with(ProjectPolicy).denies('edit', project))) {
            return response.redirect().back()
        }

        const projectPresenter = new ProjectPresenter(project)

        const capabilities = await this.projectService.findPermissionByUser(auth.user, project)
        const capabilitiesPresenter = capabilities.map(
            (capability) => new PermissionPresenter(capability)
        )

        return inertia.render('dashboard/project/editing/general', {
            project: projectPresenter.present() as ProjectDto,
            capabilities: capabilitiesPresenter.map((p) => p.present()),
        })
    }

    async roles({ inertia, auth, response, params, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().toRoute('login')
        }

        const project = await this.projectService.findById(params.id)

        if (!project || (await bouncer.with(ProjectPolicy).denies('edit', project))) {
            return response.redirect().back()
        }

        const projectPresenter = new ProjectPresenter(project)

        const capabilities = await this.projectService.findPermissionByUser(auth.user, project)
        const capabilitiesPresenter = capabilities.map(
            (capability) => new PermissionPresenter(capability)
        )

        return inertia.render('dashboard/project/editing/roles', {
            project: projectPresenter.present() as ProjectDto,
            capabilities: capabilitiesPresenter.map((p) => p.present()),
        })
    }

    async members({ inertia, auth, response, params, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().toRoute('login')
        }

        const project = await this.projectService.findById(params.id)

        if (!project || (await bouncer.with(ProjectPolicy).denies('edit', project))) {
            return response.redirect().back()
        }

        const projectPresenter = new ProjectPresenter(project)

        const capabilities = await this.projectService.findPermissionByUser(auth.user, project)
        const capabilitiesPresenter = capabilities.map(
            (capability) => new PermissionPresenter(capability)
        )

        return inertia.render('dashboard/project/editing/members', {
            project: projectPresenter.present() as ProjectDto,
            capabilities: capabilitiesPresenter.map((p) => p.present()),
        })
    }

    async task({ inertia, bouncer, params, response, auth }: HttpContext) {
        if (!auth.user) {
            return response.redirect().toRoute('login')
        }

        const project = await this.projectService.findById(params.id)

        if (!project || (await bouncer.with(ProjectPolicy).denies('read', project))) {
            return response.redirect().toRoute('home')
        }

        const presenter = new ProjectPresenter(project)

        const capabilities = await this.projectService.findPermissionByUser(auth.user, project)
        const capabilitiesPresenter = capabilities.map((capability) =>
            new PermissionPresenter(capability).present()
        )

        const task = await this.taskService.findByIdWithDetails(+params.taskId)

        if (!task) {
            return response.redirect().back()
        }

        return inertia.render('dashboard/project', {
            project: presenter.present(),
            capabilities: capabilitiesPresenter,
            task: new TaskPresenter(task).present(),
            activities: inertia.defer(async () => {
                const activities = await this.activityService.findByTaskId(task.id)
                return activities.map((activity) => {
                    return new ActivityPresenter(activity).present()
                })
            }),
        })
    }
}
