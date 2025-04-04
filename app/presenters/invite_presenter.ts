import encryption from '@adonisjs/core/services/encryption'
import ProjectInvite from '#models/project_invite'
import { UserPresenter } from '#presenters/user_presenter'

import { InviteDto } from '#types/invite.dto'

export class InvitePresenter {
    declare id: number
    declare projectId: number
    declare user?: UserPresenter
    declare email: string
    declare token: string
    declare roles: { id: number; allow: boolean }[]

    constructor(invite: ProjectInvite) {
        this.id = invite.id
        this.projectId = invite.projectId
        this.user = invite.user ? new UserPresenter(invite.user) : undefined
        this.email = invite.email
        this.token = invite.token
        this.roles = []
    }

    present(): InviteDto {
        return {
            id: this.id,
            projectId: this.projectId,
            user: this.user ? this.user.present() : undefined,
            email: this.email,
            token: this.token,
            roles: encryption.decrypt<{ project: number; roles: { id: number; allow: boolean }[] }>(
                this.token
            ).roles,
        }
    }
}
