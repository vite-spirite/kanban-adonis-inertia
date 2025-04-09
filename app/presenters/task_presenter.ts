import Task from '#models/task'
import { TaskDto } from '#types/task.dto'

export class TaskPresenter {
    declare id: number
    declare name: string
    declare description: string
    declare order: number
    declare due_date: string | null
    declare category_id: number
    declare created_at: string
    declare updated_at: string

    constructor(task: Task) {
        this.id = task.id
        this.name = task.name
        this.description = task.description
        this.order = task.order
        this.due_date = task.dueDate ? task.dueDate.toString() : null
        this.category_id = task.categoryId
        this.created_at = task.createdAt.toString()
        this.updated_at = task.updatedAt.toString()
    }

    present(): TaskDto {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            order: this.order,
            due_date: this.due_date,
            category_id: this.category_id,
            created_at: this.created_at,
            updated_at: this.updated_at,
        }
    }
}
