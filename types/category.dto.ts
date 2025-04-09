import type { TaskDto } from '#types/task.dto'

export type CategoryDto = {
    id: number
    projectId: number
    name: string
    order: number
    color: string
    tasks: TaskDto[]
}
