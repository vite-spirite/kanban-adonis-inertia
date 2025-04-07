import encryption from '@adonisjs/core/services/encryption'
import ProjectInvite from '#models/project_invite'
import { UserPresenter } from '#presenters/user_presenter'

import { InviteDto } from '#types/invite.dto'
import { ProjectPresenter } from '#presenters/project_presenter'

export class InvitePresenter {
    declare id: number
    declare projectId: number
    declare user?: UserPresenter
    declare email: string
    declare token: string
    declare roles: { id: number; allow: boolean }[]
    declare project?: ProjectPresenter
    declare createdAt: string

    constructor(invite: ProjectInvite) {
        this.id = invite.id
        this.projectId = invite.projectId
        this.user = invite.user ? new UserPresenter(invite.user) : undefined
        this.email = invite.email
        this.token = invite.token
        this.roles = []

        if (invite.project) {
            this.project = new ProjectPresenter(invite.project)
        }

        this.roles = encryption.decrypt<{
            project: number
            roles: { id: number; allow: boolean }[]
        }>(this.token).roles

        this.createdAt = invite.createdAt.toISO() || ''
    }

    present(): InviteDto {
        return {
            id: this.id,
            projectId: this.projectId,
            user: this.user ? this.user.present() : undefined,
            email: this.email,
            token: this.token,
            roles: this.roles,
            project: this.project ? this.project.present() : undefined,
            createdAt: this.createdAt,
        }
    }
}
