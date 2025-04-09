import ProjectCategory from '#models/project_category'
import type { CategoryDto } from '#types/category.dto'
import { TaskPresenter } from '#presenters/task_presenter'

export class CategoryPresenter {
    declare id: number
    declare projectId: number
    declare name: string
    declare order: number
    declare color: string

    declare tasks: TaskPresenter[]

    constructor(category: ProjectCategory) {
        this.id = category.id
        this.projectId = category.projectId
        this.name = category.name
        this.order = category.order
        this.color = category.color

        this.tasks = []

        if (category.tasks) {
            this.tasks = category.tasks.map((task) => new TaskPresenter(task))
        }
    }

    present(): CategoryDto {
        return {
            id: this.id,
            projectId: this.projectId,
            name: this.name,
            order: this.order,
            color: this.color,
            tasks: this.tasks.map((task) => task.present()),
        }
    }
}
