import type { TaskDto } from '#types/task.dto'
import type { ListLineDto } from '#types/list_line.dto'

export type ListDto = {
    id: number
    name: string
    taskId: number
    task?: TaskDto
    createdAt: string
    lines: ListLineDto[]
}
