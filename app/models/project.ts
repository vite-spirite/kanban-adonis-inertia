import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import ProjectRole from '#models/project_role'
import ProjectInvite from '#models/project_invite'
import ProjectCategory from '#models/project_category'

export default class Project extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare image?: string

    @hasMany(() => ProjectRole)
    declare roles: HasMany<typeof ProjectRole>

    @hasMany(() => ProjectInvite)
    declare invites: HasMany<typeof ProjectInvite>

    @hasMany(() => ProjectCategory)
    declare categories: HasMany<typeof ProjectCategory>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
