import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'
import { ProjectPresenter } from '#presenters/project_presenter'

@inject()
export default class DashboardController {
    constructor(private readonly projectService: ProjectService) {}

    async index({ inertia, auth, response }: HttpContext) {
        if (!auth.user) {
            return response.redirect().toRoute('login')
        }

        await this.projectService.getUserProject(auth.user)
        return inertia.render('dashboard/index')
    }

    async project({ inertia, auth, response, params }: HttpContext) {
        if (!auth.user) {
            return response.redirect().toRoute('login')
        }

        const project = await this.projectService.findById(params.id)
        const presenter = new ProjectPresenter(project)

        return inertia.render('dashboard/project', { project: presenter.present() })
    }
}
