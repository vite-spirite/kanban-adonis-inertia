import db from '@adonisjs/lucid/services/db'
import Project from '#models/project'
import Task from '#models/task'
import ProjectCategory from '#models/project_category'

export class TaskService {
    async reorder(project: Project, payload: { id: number; categoryId: number; order: number }[]) {
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
                    await Task.query({ client: trx })
                        .update({ order: task.order, categoryId: task.categoryId })
                        .where('id', task.id)
                }
            }

            return ProjectCategory.query({ client: trx })
                .whereIn('id', categoryIds)
                .preload('tasks', (s) => {
                    s.orderBy('order', 'asc')
                })
        })
    }
}
