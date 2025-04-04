import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'

export default class ProjectInvite extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare projectId: number

    @column()
    declare userId: number | null

    @column()
    declare email: string

    @column()
    declare token: string

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @belongsTo(() => Project)
    declare project: BelongsTo<typeof Project>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
