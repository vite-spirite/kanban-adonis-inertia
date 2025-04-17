import type { UserDto } from '#types/user.dto'

export type AttachmentDto = {
    id: number
    name: string
    path: string
    taskId: number
    uploadedBy: number
    createdAt: string
    updatedAt: string
    uploader?: UserDto
    url: string
}
