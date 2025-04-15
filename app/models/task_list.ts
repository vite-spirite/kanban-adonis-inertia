import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Task from '#models/task'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class TaskList extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare taskId: number

    @belongsTo(() => Task)
    declare task: BelongsTo<typeof Task>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime
}
