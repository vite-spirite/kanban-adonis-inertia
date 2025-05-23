import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'
import { ProjectCategoryService } from '#services/project_category_service'
import ProjectCategoryPolicy from '#policies/project_category_policy'
import {
    CategoryCreateValidation,
    CategoryEditValidation,
    CategoryReorderValidation,
} from '#validators/category'
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

    async edit({ request, params, auth, bouncer, response }: HttpContext) {
        const categoryId = params.categoryId

        if (!auth.user) {
            return response.redirect().back()
        }

        const category = await this.categoryService.findById(+categoryId)

        if (!category || !category.project) {
            return response.redirect().back()
        }

        if (await bouncer.with(ProjectCategoryPolicy).denies('edit', category.project)) {
            return response.redirect().back()
        }

        const payload = await request.validateUsing(CategoryEditValidation)

        const categoryUpdated = await this.categoryService.update(category, payload)

        transmit.broadcast(`/projects/${category.project.id}/categories`, {
            type: 'category.update',
            category: new CategoryPresenter(categoryUpdated).present(),
        })

        return response.redirect().back()
    }

    async delete({ params, auth, bouncer, response }: HttpContext) {
        const categoryId = params.categoryId

        if (!auth.user) {
            return response.redirect().back()
        }

        const category = await this.categoryService.findById(+categoryId)
        if (!category || !category.project) {
            return response.redirect().back()
        }

        if (await bouncer.with(ProjectCategoryPolicy).denies('delete', category.project)) {
            return response.redirect().back()
        }

        const categoryIdDeleted = await this.categoryService.delete(category)

        transmit.broadcast(`/projects/${category.project.id}/categories`, {
            type: 'category.delete',
            id: categoryIdDeleted,
        })

        return response.redirect().back()
    }

    async create({ request, params, auth, bouncer, response }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(+params.id)

        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(ProjectCategoryPolicy).denies('create', project)) {
            return response.redirect().back()
        }

        const payload = await CategoryCreateValidation.validate(request.all())

        const category = await this.categoryService.create(project, payload)

        transmit.broadcast(`/projects/${project.id}/categories`, {
            type: 'category.create',
            category: new CategoryPresenter(category).present(),
        })

        return response.redirect().back()
    }
}
