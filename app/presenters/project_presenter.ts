import Project from '#models/project'
import type { ProjectDto } from '#types/project.dto'
import { RolePresenter } from '#presenters/role_presenter'

export class ProjectPresenter {
    declare id: number
    declare name: string
    declare image?: string
    declare createdAt: string
    declare updatedAt: string

    declare roles?: RolePresenter[]

    constructor(project: Project) {
        this.id = project.id
        this.name = project.name
        this.image = project.image
        this.createdAt = project.createdAt.toISO() || ''
        this.updatedAt = project.updatedAt.toISO() || ''

        if (project.roles) {
            this.roles = project.roles.map((role) => new RolePresenter(role))
        }
    }

    present(): ProjectDto {
        return {
            id: this.id,
            name: this.name,
            image: this.image,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            roles: this.roles?.map((role) => role.present()),
        }
    }
}
