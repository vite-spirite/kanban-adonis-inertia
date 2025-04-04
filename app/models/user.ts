import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import ProjectRole from '#models/project_role'
import ProjectInvite from '#models/project_invite'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
    static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare fullName: string | null

    @column()
    declare email: string

    @column({ serializeAs: null })
    declare password: string

    @manyToMany(() => ProjectRole, {
        localKey: 'id',
        pivotForeignKey: 'user_id',
        relatedKey: 'id',
        pivotRelatedForeignKey: 'role_id',
        pivotTable: 'project_user_roles',
    })
    declare roles: ManyToMany<typeof ProjectRole>

    @hasMany(() => ProjectInvite)
    declare invites: HasMany<typeof ProjectInvite>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null
}
