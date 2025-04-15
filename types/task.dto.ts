import { TagDto } from '#types/tag.dto'
import { CategoryDto } from '#types/category.dto'
import { ListDto } from '#types/list.dto'

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
    category?: CategoryDto
    lists: ListDto[]
}
