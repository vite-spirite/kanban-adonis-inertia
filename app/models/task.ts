import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import ProjectCategory from '#models/project_category'

export default class Task extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare categoryId: number

    @column()
    declare order: number

    @column()
    declare name: string

    @column()
    declare description: string

    @belongsTo(() => ProjectCategory, { localKey: 'categoryId', foreignKey: 'id' })
    declare category: BelongsTo<typeof ProjectCategory>

    @column.dateTime()
    declare dueDate: DateTime

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
