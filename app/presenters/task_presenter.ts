import Task from '#models/task'
import { TaskDto } from '#types/task.dto'
import { TagPresenter } from '#presenters/tag_presenter'
import { CategoryPresenter } from '#presenters/category_presenter'
import { ListPresenter } from '#presenters/list_presenter'

export class TaskPresenter {
    declare id: number
    declare name: string
    declare description: string
    declare order: number
    declare dueDate: string | null
    declare categoryId: number
    declare createdAt: string
    declare updatedAt: string

    declare tags: TagPresenter[]
    declare category?: CategoryPresenter
    declare lists: ListPresenter[]

    constructor(task: Task) {
        this.id = task.id
        this.name = task.name
        this.description = task.description
        this.order = task.order
        this.dueDate = task.dueDate ? task.dueDate.toString() : null
        this.categoryId = task.categoryId
        this.createdAt = task.createdAt.toString()
        this.updatedAt = task.updatedAt.toString()

        this.tags = []
        this.lists = []

        if (task.tags && task.tags.length > 0) {
            this.tags = task.tags.map((tag) => {
                return new TagPresenter(tag)
            })
        }

        if (task.category) {
            this.category = new CategoryPresenter(task.category)
        }

        if (task.lists && task.lists.length > 0) {
            this.lists = task.lists.map((list) => {
                return new ListPresenter(list)
            })
        }
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
            tags: this.tags.map((tag) => tag.present()),
            category: this.category?.present(),
            lists: this.lists.map((l) => l.present()),
        }
    }
}
