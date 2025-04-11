import { TagDto } from '#types/tag.dto'

export type TaskDto = {
    id: number
    name: string
    description: string
    order: number
    dueDate: string | null
    categoryId: number
    createdAt: string
    updatedAt: string
    tags: TagDto[]
}
