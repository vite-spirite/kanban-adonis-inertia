import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasManyThrough } from '@adonisjs/lucid/orm'
import type { HasMany, HasManyThrough } from '@adonisjs/lucid/types/relations'
import ProjectRole from '#models/project_role'
import ProjectInvite from '#models/project_invite'
import ProjectCategory from '#models/project_category'
import ProjectTag from '#models/project_tag'
import Task from '#models/task'

export default class Project extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare image?: string

    @column()
    declare public: boolean

    @hasMany(() => ProjectRole)
    declare roles: HasMany<typeof ProjectRole>

    @hasMany(() => ProjectInvite)
    declare invites: HasMany<typeof ProjectInvite>

    @hasMany(() => ProjectCategory)
    declare categories: HasMany<typeof ProjectCategory>

    @hasMany(() => ProjectTag, { localKey: 'id', foreignKey: 'projectId' })
    declare tags: HasMany<typeof ProjectTag>

    @hasManyThrough([() => Task, () => ProjectCategory], {
        localKey: 'id',
        foreignKey: 'projectId',
        throughForeignKey: 'categoryId',
    })
    declare tasks: HasManyThrough<typeof Task>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
