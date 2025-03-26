import { HttpContext } from '@adonisjs/core/http'
import ProjectPolicy from '#policies/project_policy'
import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'
import { projectEdit } from '#validators/project'

@inject()
export default class ProjectsController {
    constructor(private readonly projectService: ProjectService) {}

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
}
