import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Project from '#models/project'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Task from '#models/task'

export default class ProjectCategory extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare projectId: number

    @column()
    declare name: string

    @column()
    declare color: string

    @column()
    declare order: number

    @belongsTo(() => Project)
    declare project: BelongsTo<typeof Project>

    @hasMany(() => Task, { localKey: 'id', foreignKey: 'categoryId' })
    declare tasks: HasMany<typeof Task>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
