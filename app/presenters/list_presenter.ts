import { TaskPresenter } from '#presenters/task_presenter'
import TaskList from '#models/task_list'
import type { ListDto } from '#types/list.dto'

export class ListPresenter {
    declare id: number
    declare name: string
    declare taskId: number
    declare createdAt: string
    declare task?: TaskPresenter

    constructor(list: TaskList) {
        this.id = list.id
        this.name = list.name
        this.taskId = list.taskId
        this.createdAt = list.createdAt.toString()

        if (list.task) {
            this.task = new TaskPresenter(list.task)
        }
    }

    present(): ListDto {
        return {
            id: this.id,
            name: this.name,
            taskId: this.taskId,
            task: this.task?.present(),
            createdAt: this.createdAt,
        }
    }
}
