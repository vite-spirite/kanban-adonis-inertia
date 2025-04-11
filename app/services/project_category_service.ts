import db from '@adonisjs/lucid/services/db'
import ProjectCategory from '#models/project_category'
import Project from '#models/project'

export class ProjectCategoryService {
    async reorder(
        project: Project,
        payload: { id: number; order: number }[]
    ): Promise<ProjectCategory[]> {
        return await db.transaction(async (trx) => {
            const categories = await ProjectCategory.query({ client: trx }).whereIn(
                'id',
                payload.map((p) => p.id)
            )

            for (const category of payload) {
                const categoryToUpdate = categories.find((c) => c.id === category.id)
                if (!categoryToUpdate || categoryToUpdate.order === category.order) {
                    continue
                }

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
                    st.orderBy('order', 'asc').preload('tags', (stt) => stt.orderBy('order', 'asc'))
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
