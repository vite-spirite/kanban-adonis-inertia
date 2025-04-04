import Project from '#models/project'
import type { ProjectDto } from '#types/project.dto'
import { RolePresenter } from '#presenters/role_presenter'
import { UserPresenter } from '#presenters/user_presenter'
import { InvitePresenter } from '#presenters/invite_presenter'

export class ProjectPresenter {
    declare id: number
    declare name: string
    declare image?: string
    declare createdAt: string
    declare updatedAt: string

    declare roles?: RolePresenter[]
    declare users?: UserPresenter[]
    declare invites?: InvitePresenter[]

    constructor(project: Project) {
        this.id = project.id
        this.name = project.name
        this.image = project.image
        this.createdAt = project.createdAt.toISO() || ''
        this.updatedAt = project.updatedAt.toISO() || ''

        this.roles = []
        this.invites = []
        this.users = []

        if (project.roles) {
            this.roles = project.roles.map((role) => new RolePresenter(role))

            this.roles.map((role) => {
                if (role.users) {
                    role.users.map((user) => {
                        if (!this.users) {
                            this.users = []
                        }

                        if (!this.users.find((u) => u.id === user.id)) {
                            this.users.push(user)
                        }
                    })
                }
            })
        }

        if (project.invites) {
            this.invites = project.invites.map((invite) => new InvitePresenter(invite))
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
            users: this.users?.map((user) => user.present()),
            invites: this.invites?.map((invite) => invite.present()),
        }
    }
}
