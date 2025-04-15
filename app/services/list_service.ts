import Task from '#models/task'
import TaskList from '#models/task_list'

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
}
