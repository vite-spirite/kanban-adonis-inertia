import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import { TaskService } from '#services/task_service'
import { ProjectService } from '#services/project_service'
import { ActivityService } from '#services/activity_service'
import {
    TaskCreateValidator,
    TaskReorderValidator,
    TaskTagEditingValidator,
    TaskUpdateValidator,
} from '#validators/task'
import transmit from '@adonisjs/transmit/services/main'
import { CategoryPresenter } from '#presenters/category_presenter'
import TaskPolicy from '#policies/task_policy'
import { TaskPresenter } from '#presenters/task_presenter'
import Task from '#models/task'
import Project from '#models/project'

@inject()
export default class TasksController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly taskService: TaskService,
        private readonly activityService: ActivityService
    ) {}

    private submitUpdateSSE(task: Task, project: Project) {
        this.taskService.findById(task.id).then((t) => {
            if (!t) {
                return
            }

            transmit.broadcast(`/projects/${project.id}/category/${t.categoryId}/tasks`, {
                type: 'task.updated',
                task: new TaskPresenter(t).present(),
            })
        })

        this.taskService.findByIdWithDetails(task.id).then((taskDetail) => {
            if (taskDetail) {
                transmit.broadcast(`/projects/${project.id}/task/${taskDetail.id}/details`, {
                    type: 'task.updated',
                    task: new TaskPresenter(taskDetail).present(),
                })
            }
        })
    }

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
        const categoriesTasks = await this.taskService.reorder(project, payload.tasks, auth.user.id)

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

        await task.load('category')

        await this.activityService.createActivity({
            projectId: project.id,
            actorId: auth.user.id,
            subjectType: 'task',
            subjectId: task.id,
            type: 'task_created',
            meta: {
                name: task.name,
                category: task.category.name,
            },
        })

        transmit.broadcast(`/projects/${project.id}/category/${task.categoryId}/tasks`, {
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

        const task = await project
            .related('tasks')
            .query()
            .preload('tags')
            .where('tasks.id', +params.taskId)
            .first()

        if (!task) {
            return response.redirect().back()
        }

        if (await bouncer.with(TaskPolicy).denies('edit', project)) {
            return response.redirect().back()
        }

        const payload = await TaskTagEditingValidator.validate(request.all())

        const afterTags = task.tags.map((t) => t.serialize())

        const taskUpdated = await this.taskService.updateTags(task, payload.tags)

        if (!taskUpdated) {
            return response.redirect().back()
        }

        const beforeTags = taskUpdated.tags.map((t) => t.serialize())

        const addedTags = beforeTags.filter((tag) => !afterTags.some((t) => t.id === tag.id))
        const removedTags = afterTags.filter((tag) => !beforeTags.some((t) => t.id === tag.id))

        await this.activityService.createMany([
            ...addedTags.map((tag) => ({
                projectId: project.id,
                actorId: auth.user.id,
                subjectType: 'task',
                subjectId: taskUpdated.id,
                type: 'task_tag_added',
                meta: {
                    name: tag.name,
                    color: tag.color,
                },
            })),
            ...removedTags.map((tag) => ({
                projectId: project.id,
                actorId: auth.user.id,
                subjectType: 'task',
                subjectId: taskUpdated.id,
                type: 'task_tag_removed',
                meta: {
                    name: tag.name,
                    color: tag.color,
                },
            })),
        ])

        this.submitUpdateSSE(taskUpdated, project)

        return response.redirect().back()
    }

    async update({ request, params, auth, bouncer, response }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(+params.id)
        if (!project) {
            return response.redirect().back()
        }

        const task = await project
            .related('tasks')
            .query()
            .where('tasks.id', +params.taskId)
            .first()

        if (!task) {
            return response.redirect().back()
        }

        if (await bouncer.with(TaskPolicy).denies('edit', project)) {
            return response.redirect().back()
        }

        const payload = await TaskUpdateValidator.validate(request.all())

        const baseTask = task.serialize()
        const taskUpdated = await this.taskService.update(task, payload)

        if (!taskUpdated) {
            return response.redirect().back()
        }

        if (
            baseTask.name !== taskUpdated.name ||
            baseTask.description !== taskUpdated.description ||
            baseTask.dueDate !== taskUpdated.dueDate
        ) {
            await this.activityService.createActivity({
                projectId: project.id,
                actorId: auth.user.id,
                subjectType: 'task',
                subjectId: taskUpdated.id,
                type: 'task_updated',
                meta: {
                    fromName: baseTask.name,
                    fromDescription: baseTask.description,
                    fromDueDate: baseTask.dueDate,
                    toName: taskUpdated.name,
                    toDescription: taskUpdated.description,
                    toDueDate: taskUpdated.dueDate,
                },
            })
        }

        this.submitUpdateSSE(taskUpdated, project)

        return response.redirect().back()
    }

    async delete({ request, params, auth, bouncer, response }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(+params.id)
        if (!project) {
            return response.redirect().back()
        }

        const task = await project
            .related('tasks')
            .query()
            .where('tasks.id', +params.taskId)
            .first()

        if (!task) {
            return response.redirect().back()
        }

        if (await bouncer.with(TaskPolicy).denies('delete', project)) {
            return response.redirect().back()
        }

        await this.taskService.delete(task)

        await this.activityService.createActivity({
            projectId: project.id,
            actorId: auth.user.id,
            subjectType: 'task',
            subjectId: task.id,
            type: 'task_deleted',
            meta: {
                name: task.name,
            },
        })

        transmit.broadcast(`/projects/${project.id}/category/${task.categoryId}/tasks`, {
            type: 'task.deleted',
            task: new TaskPresenter(task).present(),
        })

        transmit.broadcast(`/projects/${project.id}/task/${task.id}/details`, {
            type: 'task.deleted',
            task: new TaskPresenter(task).present(),
        })

        return response.redirect().back()
    }
}
