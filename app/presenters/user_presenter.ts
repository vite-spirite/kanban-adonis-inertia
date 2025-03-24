import User from '#models/user'
import type { MeDto, UserDto } from '#types/user.dto'

export class UserPresenter {
    declare id: number
    declare fullName: string
    declare email: string
    declare createdAt: string
    declare updatedAt: string

    constructor(user: User) {
        this.id = user.id
        this.fullName = user.fullName
        this.email = user.email
        this.createdAt = user.createdAt.toISO() || ''
        this.updatedAt = user.updatedAt.toISO() || ''
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
        }
    }
}
