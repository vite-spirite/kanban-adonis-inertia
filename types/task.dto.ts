export type TaskDto = {
    id: number
    name: string
    description: string
    order: number
    dueDate: string | null
    categoryId: number
    createdAt: string
    updatedAt: string
}
