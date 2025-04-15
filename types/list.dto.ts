import type { TaskDto } from '#types/task.dto'

export type ListDto = {
    id: number
    name: string
    taskId: number
    task?: TaskDto
    createdAt: string
}
