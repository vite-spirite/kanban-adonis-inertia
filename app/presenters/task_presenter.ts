import Task from '#models/task'
import { TaskDto } from '#types/task.dto'

export class TaskPresenter {
    declare id: number
    declare name: string
    declare description: string
    declare order: number
    declare dueDate: string | null
    declare categoryId: number
    declare createdAt: string
    declare updatedAt: string

    constructor(task: Task) {
        this.id = task.id
        this.name = task.name
        this.description = task.description
        this.order = task.order
        this.dueDate = task.dueDate ? task.dueDate.toString() : null
        this.categoryId = task.categoryId
        this.createdAt = task.createdAt.toString()
        this.updatedAt = task.updatedAt.toString()
    }

    present(): TaskDto {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            order: this.order,
            dueDate: this.dueDate,
            categoryId: this.categoryId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}
