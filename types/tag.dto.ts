import { MinimalProjectDto } from '#types/project.dto'

export type TagDto = {
    id: number
    name: string
    color: string
    projectId: number
    project?: MinimalProjectDto
}
