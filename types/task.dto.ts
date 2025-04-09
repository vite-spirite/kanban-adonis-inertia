export type TaskDto = {
    id: number
    name: string
    description: string
    order: number
    due_date: string | null
    category_id: number
    created_at: string
    updated_at: string
}
