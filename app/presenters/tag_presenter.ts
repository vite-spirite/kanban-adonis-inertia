import { ProjectPresenter } from '#presenters/project_presenter'
import ProjectTag from '#models/project_tag'
import { TagDto } from '#types/tag.dto'

export class TagPresenter {
    declare id: number
    declare name: string
    declare color: string
    declare projectId: number
    declare project?: ProjectPresenter

    constructor(tag: ProjectTag) {
        this.id = tag.id
        this.name = tag.name
        this.color = tag.color
        this.projectId = tag.projectId
        this.project = tag.project ? new ProjectPresenter(tag.project) : undefined
    }

    present(): TagDto {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            projectId: this.projectId,
            project: this.project?.present(),
        }
    }
}
