import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'

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
}
