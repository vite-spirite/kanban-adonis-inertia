// import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'
import { ProjectCategoryService } from '#services/project_category_service'
import { HttpContext } from '@adonisjs/core/http'
import ProjectCategoryPolicy from '#policies/project_category_policy'
import { CategoryReorderValidation } from '#validators/category'
import transmit from '@adonisjs/transmit/services/main'
import { CategoryPresenter } from '#presenters/category_presenter'

@inject()
export default class ProjectCategoriesController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly categoryService: ProjectCategoryService
    ) {}

    async reorder({ request, params, auth, bouncer, response }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(params.id)

        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(ProjectCategoryPolicy).denies('move', project)) {
            return response.redirect().back()
        }

        const payload = await CategoryReorderValidation.validate(request.all())

        const categories = await this.categoryService.reorder(project, payload.categories)

        transmit.broadcast(`/projects/${project.id}/categories`, {
            type: 'category.reorder',
            categories: categories.map((c) => new CategoryPresenter(c).present()),
        })

        return response.redirect().back()
    }
}
