import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Project from '#models/project'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Activity extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare projectId: number

    @column()
    declare actorId: number

    @column()
    declare subjectType: string

    @column()
    declare subjectId: number

    @column()
    declare type: string

    @column()
    declare meta: any | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @belongsTo(() => Project, {
        foreignKey: 'projectId',
        localKey: 'id',
    })
    declare project: BelongsTo<typeof Project>

    @belongsTo(() => User, {
        foreignKey: 'actorId',
        localKey: 'id',
    })
    declare actor: BelongsTo<typeof User>
}
