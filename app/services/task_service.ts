import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Project from '#models/project'
import Task from '#models/task'
import ProjectCategory from '#models/project_category'
import Activity from '#models/activity'

export class TaskService {
    async findById(id: number): Promise<Task | null> {
        return Task.query()
            .preload('tags', (s) => s.orderBy('order', 'asc'))
            .withCount('lines', (wc) => wc.as('linesCount'))
            .withCount('lines', (wc) => wc.as('completedCount').whereNotNull('completedAt'))
            .where('id', id)
            .first()
    }

    async findByIdWithDetails(id: number): Promise<Task | null> {
        return Task.query()
            .preload('tags', (s) => s.orderBy('order', 'asc'))
            .preload('category')
            .preload('lists', (s) =>
                s
                    .orderBy('createdAt', 'asc')
                    .preload('lines', (q) => q.orderBy('order', 'asc').preload('user'))
            )
            .withCount('lines', (wc) => wc.as('linesCount'))
            .withCount('lines', (wc) => wc.as('completedCount').whereNotNull('completedAt'))
            .preload('attachments', (q) => q.preload('uploader'))
            .where('id', id)
            .first()
    }

    async reorder(
        project: Project,
        payload: { id: number; categoryId: number; order: number }[],
        userId: number
    ) {
        return await db.transaction(async (trx) => {
            const categories =
                project.categories ??
                (await project.related('categories').query({ client: trx }).preload('tasks'))

            const currentTasks = categories.map((category) => category.tasks).flat()
            const categoryIds = categories.map((category) => category.id)

            for (const task of payload) {
                const taskToUpdate = currentTasks.find((t) => t.id === task.id)

                if (
                    !taskToUpdate ||
                    (taskToUpdate.categoryId === task.categoryId &&
                        taskToUpdate.order === task.order)
                ) {
                    continue
                }

                if (categoryIds.includes(task.categoryId)) {
                    if (taskToUpdate.categoryId !== task.categoryId) {
                        await Activity.create(
                            {
                                projectId: project.id,
                                actorId: userId,
                                subjectType: 'task',
                                subjectId: task.id,
                                type: 'task_moved',
                                meta: {
                                    from: categories.find((c) => c.id === taskToUpdate.categoryId)
                                        ?.name,
                                    to: categories.find((c) => c.id === task.categoryId)?.name,
                                },
                            },
                            { client: trx }
                        )
                    }

                    await Task.query({ client: trx })
                        .update({ order: task.order, categoryId: task.categoryId })
                        .where('id', task.id)
                }
            }

            return ProjectCategory.query({ client: trx })
                .whereIn('id', categoryIds)
                .preload('tasks', (s) => {
                    s.orderBy('order', 'asc').preload('tags', (st) => st.orderBy('order', 'asc'))
                })
                .orderBy('order', 'asc')
        })
    }

    async create(
        project: Project,
        payload: {
            categoryId: number
            order: number
            name: string
            description: string
            dueDate?: string
        }
    ) {
        const category =
            project.categories.find((c) => c.id === payload.categoryId) ??
            (await project.related('categories').query().where('id', payload.categoryId).first())

        if (!category) {
            return null
        }

        return category.related('tasks').create({
            categoryId: payload.categoryId,
            order: payload.order,
            name: payload.name,
            description: payload.description,
            dueDate: payload.dueDate ? DateTime.fromISO(payload.dueDate) : undefined,
        })
    }

    async updateTags(task: Task, payload: { id: number; order: number }[]) {
        const synchronizeArray: Record<number, { order: number }> = {}

        for (const tag of payload) {
            synchronizeArray[tag.id] = { order: tag.order }
        }

        await task.related('tags').sync(synchronizeArray, true)

        return this.findById(task.id)
    }

    async update(task: Task, payload: { name?: string; description?: string; dueDate?: string }) {
        return task
            .merge({
                ...payload,
                dueDate: payload.dueDate ? DateTime.fromISO(payload.dueDate) : null,
            })
            .save()
    }

    async delete(task: Task): Promise<void> {
        return task.delete()
    }
}
