import type { HttpContext } from '@adonisjs/core/http'

import TaskAttachment from '#models/task_attachment'
import TaskPolicy from '#policies/task_policy'
import { inject } from '@adonisjs/core'
import { ProjectService } from '#services/project_service'
import { AttachmentCreateValidator } from '#validators/attachment'
import { cuid } from '@adonisjs/core/helpers'
import drive from '@adonisjs/drive/services/main'
import app from '@adonisjs/core/services/app'
import Task from '#models/task'
import Project from '#models/project'
import transmit from '@adonisjs/transmit/services/main'
import { TaskPresenter } from '#presenters/task_presenter'
import { TaskService } from '#services/task_service'

@inject()
export default class AttachmentsController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly taskService: TaskService
    ) {}

    private submitUpdateSSE(task: Task, project: Project) {
        transmit.broadcast(`/projects/${project.id}/category/${task.categoryId}/tasks`, {
            type: 'task.updated',
            task: new TaskPresenter(task).present(),
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

    async download({ params, auth, response, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const attachment = await TaskAttachment.query()
            .where('id', +params.attachmentId)
            .preload('task', (q) => q.preload('category'))
            .first()

        if (!attachment) {
            return response.redirect().back()
        }

        const project = await attachment.task.category.related('project').query().first()
        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(TaskPolicy).denies('download', project)) {
            return response.redirect().back()
        }

        const filePath = app.makePath('attachments', attachment.path)
        return response.attachment(filePath, attachment.name)
    }

    async upload({ params, auth, response, request, bouncer }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const project = await this.projectService.findById(+params.id)

        if (!project) {
            return response.redirect().back()
        }

        if (await bouncer.with(TaskPolicy).denies('upload', project)) {
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

        const payload = await request.validateUsing(AttachmentCreateValidator)

        const key = `${cuid()}.${payload.file.extname}`
        await payload.file.moveToDisk(key, 'attachments')

        await TaskAttachment.create({
            name: payload.file.clientName,
            path: payload.file.filePath,
            taskId: task.id,
            uploadedBy: auth.user.id,
        })

        this.submitUpdateSSE(task, project)

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

        if (await bouncer.with(TaskPolicy).denies('deleteFile', project)) {
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

        const attachment = await task
            .related('attachments')
            .query()
            .where('id', +params.attachmentId)
            .first()

        if (!attachment) {
            return response.redirect().back()
        }

        await attachment.delete()

        const disk = drive.use('attachments')

        if (await disk.exists(attachment.path)) {
            await disk.delete(attachment.path)
        }

        this.submitUpdateSSE(task, project)

        return response.redirect().back()
    }
}
