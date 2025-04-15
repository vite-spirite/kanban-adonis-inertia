// import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'
import { ListService } from '#services/list_service'
import { TaskService } from '#services/task_service'
import { HttpContext } from '@adonisjs/core/http'
import ListPolicy from '#policies/list_policy'
import { ListCreateValidator } from '#validators/list'
import transmit from '@adonisjs/transmit/services/main'
import { TaskPresenter } from '#presenters/task_presenter'

@inject()
export default class ListsController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly listService: ListService,
        private readonly taskService: TaskService
    ) {}

    private submitTaskUpdate(taskId: number, projectId: number) {
        this.taskService.findById(taskId).then((task) => {
            if (!task) return

            transmit.broadcast(`/projects/${projectId}/category/${task.categoryId}/tasks`, {
                type: 'task.updated',
                task: new TaskPresenter(task).present(),
            })
        })

        this.taskService.findByIdWithDetails(taskId).then((task) => {
            if (!task) return

            transmit.broadcast(`/projects/${projectId}/task/${task.id}/details`, {
                type: 'task.updated',
                task: new TaskPresenter(task).present(),
            })
        })
    }

    async create({ params, auth, bouncer, request, response }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(+params.id)

        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(ListPolicy).denies('create', project)) {
            return response.redirect().back()
        }

        const task = await this.taskService.findById(+params.taskId)
        if (!task) {
            return response.redirect().back()
        }

        const payload = await ListCreateValidator.validate(request.all())
        await this.listService.create(task, payload)

        this.submitTaskUpdate(task.id, project.id)

        return response.redirect().back()
    }

    async update({ params, auth, request, response, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(+params.id)
        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(ListPolicy).denies('update', project)) {
            return response.redirect().back()
        }

        const list = await this.listService.findById(+params.listId)
        if (!list) {
            return response.redirect().back()
        }

        const payload = await ListCreateValidator.validate(request.all())
        await this.listService.update(list, payload)

        this.submitTaskUpdate(list.taskId, project.id)

        return response.redirect().back()
    }

    async delete({ params, auth, response, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(+params.id)

        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(ListPolicy).denies('delete', project)) {
            return response.redirect().back()
        }

        const list = await this.listService.findById(+params.listId)
        if (!list || list.taskId !== +params.taskId) {
            return response.redirect().back()
        }

        await this.listService.delete(list)

        this.submitTaskUpdate(list.taskId, project.id)

        return response.redirect().back()
    }
}
