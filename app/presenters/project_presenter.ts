import Project from '#models/project'
import type { ProjectDto } from '#types/project.dto'
import { RolePresenter } from '#presenters/role_presenter'
import { UserPresenter } from '#presenters/user_presenter'
import { InvitePresenter } from '#presenters/invite_presenter'
import { CategoryPresenter } from '#presenters/category_presenter'
import { TagPresenter } from '#presenters/tag_presenter'

export class ProjectPresenter {
    declare id: number
    declare name: string
    declare image?: string
    declare public: boolean
    declare createdAt: string
    declare updatedAt: string

    declare roles?: RolePresenter[]
    declare users?: UserPresenter[]
    declare invites?: InvitePresenter[]
    declare categories: CategoryPresenter[]
    declare tags?: TagPresenter[]

    constructor(project: Project) {
        this.id = project.id
        this.name = project.name
        this.image = project.image
        this.public = project.public
        this.createdAt = project.createdAt.toISO() || ''
        this.updatedAt = project.updatedAt.toISO() || ''

        this.roles = []
        this.invites = []
        this.users = []
        this.categories = []
        this.tags = []

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

        if (project.categories) {
            this.categories = project.categories.map((category) => new CategoryPresenter(category))
            this.categoriesOrder()
        }

        if (project.tags) {
            this.tags = project.tags.map((tag) => new TagPresenter(tag))
        }
    }

    private categoriesOrder() {
        if (this.categories) {
            this.categories.sort((a, b) => a.order - b.order)
        }
    }

    present(): ProjectDto {
        return {
            id: this.id,
            name: this.name,
            image: this.image,
            public: this.public,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            roles: this.roles?.map((role) => role.present()),
            users: this.users?.map((user) => user.present()),
            invites: this.invites?.map((invite) => invite.present()),
            categories: this.categories.map((category) => category.present()),
            tags: this.tags.map((tag) => tag.present()),
        }
    }
}
