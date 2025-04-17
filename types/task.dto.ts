import type { TagDto } from '#types/tag.dto'
import type { CategoryDto } from '#types/category.dto'
import type { ListDto } from '#types/list.dto'
import type { AttachmentDto } from '#types/attachment.dto'

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
    totalCompletedLines?: number
    totalLines?: number
    attachments: AttachmentDto[]
}
