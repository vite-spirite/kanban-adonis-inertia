import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Task from '#models/task'

export default class TaskAttachment extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare path: string

    @column()
    declare taskId: number

    @column()
    declare uploadedBy: number

    @belongsTo(() => User, {
        foreignKey: 'uploadedBy',
        localKey: 'id',
    })
    declare uploader: BelongsTo<typeof User>

    @belongsTo(() => Task)
    declare task: BelongsTo<typeof Task>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
