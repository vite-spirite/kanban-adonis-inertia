import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { TagCreateValidator } from '#validators/tag'
import transmit from '@adonisjs/transmit/services/main'
import { TagPresenter } from '#presenters/tag_presenter'
import ProjectTagPolicy from '#policies/project_tag_policy'
import { ProjectService } from '#services/project_service'

@inject()
export default class ProjectTagsController {
    constructor(private readonly projectService: ProjectService) {}

    async create({ request, auth, params, response, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(+params.id)

        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(ProjectTagPolicy).denies('create', project)) {
            return response.redirect().back()
        }

        const payload = await TagCreateValidator.validate(request.all())

        const tag = await this.projectService.createTag(project, payload)

        transmit.broadcast(`/projects/${project.id}/tags`, {
            type: 'tag.created',
            tag: new TagPresenter(tag).present(),
        })

        return response.redirect().back()
    }
}
