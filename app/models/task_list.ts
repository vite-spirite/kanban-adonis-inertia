import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Task from '#models/task'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ListLine from '#models/list_line'

export default class TaskList extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare taskId: number

    @hasMany(() => ListLine, { localKey: 'id', foreignKey: 'listId' })
    declare lines: HasMany<typeof ListLine>

    @belongsTo(() => Task)
    declare task: BelongsTo<typeof Task>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime
}
