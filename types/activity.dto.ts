import type { ProjectDto } from '#types/project.dto'
import type { UserDto } from '#types/user.dto'

export type ActivityDto = {
    id: number
    actorId: number
    projectId: number
    subjectType: string
    subjectId: number
    type: string

    actor?: UserDto

    project?: ProjectDto

    createdAt: string
    meta: any | null
}

export type CreateActivityDto = {
    projectId: number
    actorId: number
    subjectType: 'task' | 'list' | 'list_line' | 'attachment'
    subjectId: number
    type: ActivityType
    meta?: any | null
}

type ActivityType =
    | 'task_created'
    | 'task_updated '
    | 'task_deleted'
    | 'task_moved'
    | 'task_tag_removed'
    | 'task_tag_added'
    | 'list_created'
    | 'list_updated'
    | 'list_deleted'
    | 'list_line_created'
    | 'list_line_updated'
    | 'list_line_deleted'
    | 'list_line_completed'
    | 'list_line_uncompleted'
    | 'attachment_added'
    | 'attachment_deleted'
