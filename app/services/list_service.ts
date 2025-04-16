import Task from '#models/task'
import TaskList from '#models/task_list'
import User from '#models/user'
import ListLine from '#models/list_line'
import { DateTime } from 'luxon'

export class ListService {
    async findById(id: number): Promise<TaskList | null> {
        return TaskList.query().where('id', id).first()
    }

    async create(task: Task, payload: { name: string }) {
        return task.related('lists').create(payload)
    }

    async update(list: TaskList, payload: { name: string }) {
        return list.merge(payload).save()
    }

    async delete(list: TaskList): Promise<void> {
        return list.delete()
    }

    async findLineById(list: TaskList, line: number): Promise<ListLine | null> {
        return list.related('lines').query().where('id', line).first()
    }

    async createRow(list: TaskList, payload: { name: string; order: number }) {
        return list.related('lines').create(payload)
    }

    async toggle(line: ListLine, user: User) {
        if (line.completedAt) {
            line.completedAt = null
            line.completedBy = null
        } else {
            line.completedBy = user.id
            line.completedAt = DateTime.now()
        }

        return line.save()
    }

    async deleteRow(line: ListLine) {
        return line.delete()
    }
}
