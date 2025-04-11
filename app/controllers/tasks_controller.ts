import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { TaskService } from '#services/task_service'
import { ProjectService } from '#services/project_service'
import {
    TaskCreateValidator,
    TaskReorderValidator,
    TaskTagEditingValidator,
} from '#validators/task'
import transmit from '@adonisjs/transmit/services/main'
import { CategoryPresenter } from '#presenters/category_presenter'
import TaskPolicy from '#policies/task_policy'
import { TaskPresenter } from '#presenters/task_presenter'

@inject()
export default class TasksController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly taskService: TaskService
    ) {}

    async reorder({ request, params, auth, bouncer, response }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(+params.id)

        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(TaskPolicy).denies('order', project)) {
            return response.redirect().back()
        }

        const payload = await TaskReorderValidator.validate(request.all())
        const categoriesTasks = await this.taskService.reorder(project, payload.tasks)

        transmit.broadcast(`/projects/${project.id}/categories`, {
            type: 'category.reorder',
            categories: categoriesTasks.map((c) => new CategoryPresenter(c).present()),
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

        if (await bouncer.with(TaskPolicy).denies('create', project)) {
            return response.redirect().back()
        }

        const payload = await TaskCreateValidator.validate(request.all())

        const task = await this.taskService.create(project, payload)

        if (!task) {
            return response.redirect().back()
        }

        transmit.broadcast(`/projects/${project.id}/category/${task.categoryId}`, {
            type: 'task.created',
            task: new TaskPresenter(task).present(),
        })

        return response.redirect().back()
    }

    async updateTags({ request, auth, response, params, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(+params.id)
        if (!project) {
            return response.redirect().back()
        }

        const task = await this.taskService.findById(+params.taskId)
        if (!task) {
            return response.redirect().back()
        }

        if (await bouncer.with(TaskPolicy).denies('edit', project)) {
            return response.redirect().back()
        }

        const payload = await TaskTagEditingValidator.validate(request.all())

        const taskUpdated = await this.taskService.updateTags(task, payload.tags)

        transmit.broadcast(`/projects/${project.id}/category/${task.categoryId}/tasks`, {
            type: 'task.updated',
            task: new TaskPresenter(taskUpdated).present(),
        })

        return response.redirect().back()
    }
}
