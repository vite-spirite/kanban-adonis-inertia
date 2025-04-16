import type { UserDto } from '#types/user.dto'

export type ListLineDto = {
    id: number
    name: string
    order: number
    listId: number
    completedAt: string | null
    completedBy: number | null
    createdAt: string
    updatedAt: string
    user: UserDto | null
}
