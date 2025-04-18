// import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'
import { ListService } from '#services/list_service'
import { TaskService } from '#services/task_service'
import { HttpContext } from '@adonisjs/core/http'
import ListPolicy from '#policies/list_policy'
import {
    ListCreateValidator,
    ListLineCreateValidator,
    ListLineUpdateValidator,
} from '#validators/list'
import transmit from '@adonisjs/transmit/services/main'
import { TaskPresenter } from '#presenters/task_presenter'
import { ActivityService } from '#services/activity_service'

@inject()
export default class ListsController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly listService: ListService,
        private readonly taskService: TaskService,
        private readonly activityService: ActivityService
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
        const list = await this.listService.create(task, payload)

        await this.activityService.createActivity({
            actorId: auth.user.id,
            projectId: project.id,
            subjectType: 'list',
            subjectId: list.id,
            type: 'list_created',
            meta: { task_id: task.id, name: list.name },
        })

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

        const baseList = list.serialize()

        const payload = await ListCreateValidator.validate(request.all())
        await this.listService.update(list, payload)

        await this.activityService.createActivity({
            actorId: auth.user.id,
            projectId: project.id,
            subjectType: 'list',
            subjectId: list.id,
            type: 'list_updated',
            meta: { fromName: baseList.name, toName: list.name, task_id: list.taskId },
        })

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

        await this.activityService.createActivity({
            actorId: auth.user.id,
            projectId: project.id,
            subjectType: 'list',
            subjectId: list.id,
            type: 'list_deleted',
            meta: { task_id: list.taskId, name: list.name },
        })

        this.submitTaskUpdate(list.taskId, project.id)

        return response.redirect().back()
    }

    async createRow({ params, auth, request, bouncer, response }: HttpContext) {
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
        if (!list || list.taskId !== +params.taskId) {
            return response.redirect().back()
        }

        const payload = await ListLineCreateValidator.validate(request.all())
        const line = await this.listService.createRow(list, payload)

        await this.activityService.createActivity({
            actorId: auth.user.id,
            projectId: project.id,
            subjectType: 'list_line',
            subjectId: line.id,
            type: 'list_line_created',
            meta: { task_id: list.taskId, name: payload.name, listName: list.name },
        })

        this.submitTaskUpdate(list.taskId, project.id)

        return response.redirect().back()
    }

    async toggleRow({ params, auth, bouncer, response }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(+params.id)
        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(ListPolicy).denies('check', project)) {
            return response.redirect().back()
        }

        const list = await this.listService.findById(+params.listId)

        if (!list) {
            return response.redirect().back()
        }

        const line = await this.listService.findLineById(list, +params.rowId)

        if (!line) {
            return response.redirect().back()
        }

        await this.listService.toggle(line, auth.user)

        await this.activityService.createActivity({
            actorId: auth.user.id,
            projectId: project.id,
            subjectType: 'list_line',
            subjectId: line.id,
            type: line.completedAt ? 'list_line_completed' : 'list_line_uncompleted',
            meta: { task_id: list.taskId, name: line.name, listName: list.name },
        })

        this.submitTaskUpdate(list.taskId, project.id)

        return response.redirect().back()
    }

    async deleteRow({ params, auth, response, bouncer }: HttpContext) {
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

        const line = await this.listService.findLineById(list, +params.rowId)
        if (!line) {
            return response.redirect().back()
        }

        await this.listService.deleteRow(line)

        await this.activityService.createActivity({
            actorId: auth.user.id,
            projectId: project.id,
            subjectType: 'list_line',
            subjectId: line.id,
            type: 'list_line_deleted',
            meta: { task_id: list.taskId, name: line.name, listName: list.name },
        })

        this.submitTaskUpdate(list.taskId, project.id)

        return response.redirect().back()
    }

    async updateRow({ params, auth, request, bouncer, response }: HttpContext) {
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

        const line = await this.listService.findLineById(list, +params.rowId)
        if (!line) {
            return response.redirect().back()
        }

        const baseLine = line.serialize()

        const payload = await ListLineUpdateValidator.validate(request.all())

        await this.listService.updateLine(line, payload)
        this.submitTaskUpdate(list.taskId, project.id)

        await this.activityService.createActivity({
            actorId: auth.user.id,
            projectId: project.id,
            subjectType: 'list_line',
            subjectId: line.id,
            type: 'list_line_updated',
            meta: {
                task_id: list.taskId,
                fromName: baseLine.name,
                toName: payload.name,
                listName: list.name,
            },
        })

        return response.redirect().back()
    }
}
