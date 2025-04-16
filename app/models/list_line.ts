import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import TaskList from '#models/task_list'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class ListLine extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare order: number

    @column()
    declare listId: number

    @belongsTo(() => TaskList)
    declare list: BelongsTo<typeof TaskList>

    @column.dateTime()
    declare completedAt: DateTime | null

    @column()
    declare completedBy: number | null

    @belongsTo(() => User, { foreignKey: 'completedBy', localKey: 'id' })
    declare user: BelongsTo<typeof User> | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
