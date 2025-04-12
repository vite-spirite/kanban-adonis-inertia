import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import ProjectCategory from '#models/project_category'
import ProjectTag from '#models/project_tag'

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

    @belongsTo(() => ProjectCategory, { foreignKey: 'categoryId', localKey: 'id' })
    declare category: BelongsTo<typeof ProjectCategory>

    @manyToMany(() => ProjectTag, {
        pivotTable: 'project_tag_tasks',
        pivotForeignKey: 'task_id',
        pivotRelatedForeignKey: 'tag_id',
        pivotColumns: ['order'],
    })
    declare tags: ManyToMany<typeof ProjectTag>

    @column.dateTime()
    declare dueDate: DateTime

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
