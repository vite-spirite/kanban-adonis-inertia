import User from '#models/user'
import type { MeDto, UserDto } from '#types/user.dto'
import { InvitePresenter } from '#presenters/invite_presenter'

export class UserPresenter {
    declare id: number
    declare fullName: string
    declare email: string
    declare createdAt: string
    declare updatedAt: string

    declare invites: InvitePresenter[]

    constructor(user: User) {
        this.id = user.id
        this.fullName = user.fullName || ''
        this.email = user.email
        this.createdAt = user.createdAt.toISO() || ''
        this.updatedAt = user.updatedAt?.toISO() || ''

        this.invites = []

        if (user.invites) {
            this.invites = user.invites.map((invite) => new InvitePresenter(invite))
        }
    }

    present(): UserDto {
        return {
            id: this.id,
            fullName: this.fullName,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }

    presentMe(): MeDto {
        return {
            id: this.id,
            fullName: this.fullName,
            email: this.email,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            invites: this.invites.map((invite) => invite.present()),
        }
    }
}
