import db from '@adonisjs/lucid/services/db'
import ProjectCategory from '#models/project_category'
import Project from '#models/project'

export class ProjectCategoryService {
    async reorder(
        project: Project,
        payload: { id: number; order: number }[]
    ): Promise<ProjectCategory[]> {
        const orderedPayload = payload.sort((a, b) => a.order - b.order)

        return await db.transaction(async (trx) => {
            for (const category of orderedPayload) {
                await ProjectCategory.query({ client: trx })
                    .where('id', category.id)
                    .update({ order: category.order })
            }

            await trx.commit()

            return project
                .related('categories')
                .query({ client: trx })
                .orderBy('order', 'asc')
                .preload('tasks', (st) => {
                    st.orderBy('order', 'asc')
                })
        })
    }

    async findById(id: number): Promise<ProjectCategory | null> {
        return ProjectCategory.query().preload('project').where('id', id).first()
    }

    async update(
        category: ProjectCategory,
        payload: { name?: string; color?: string }
    ): Promise<ProjectCategory> {
        return category.merge(payload).save()
    }

    async delete(category: ProjectCategory): Promise<number> {
        await category.delete()
        return category.id
    }

    async create(
        project: Project,
        payload: { name: string; color: string; order: number }
    ): Promise<ProjectCategory> {
        return project.related('categories').create(payload)
    }
}
