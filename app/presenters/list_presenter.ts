import { TaskPresenter } from '#presenters/task_presenter'
import TaskList from '#models/task_list'
import type { ListDto } from '#types/list.dto'
import { ListLinePresenter } from '#presenters/list_line_presenter'

export class ListPresenter {
    declare id: number
    declare name: string
    declare taskId: number
    declare createdAt: string
    declare task?: TaskPresenter
    declare lines: ListLinePresenter[]

    constructor(list: TaskList) {
        this.id = list.id
        this.name = list.name
        this.taskId = list.taskId
        this.createdAt = list.createdAt.toString()

        this.lines = []

        if (list.task) {
            this.task = new TaskPresenter(list.task)
        }

        if (list.lines) {
            this.lines = list.lines.map((line) => {
                return new ListLinePresenter(line)
            })
        }
    }

    present(): ListDto {
        return {
            id: this.id,
            name: this.name,
            taskId: this.taskId,
            task: this.task?.present(),
            createdAt: this.createdAt,
            lines: this.lines.map((line) => line.present()),
        }
    }
}
