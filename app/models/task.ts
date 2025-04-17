import type {
    BelongsTo,
    HasMany,
    HasManyThrough,
    ManyToMany,
} from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import {
    BaseModel,
    belongsTo,
    column,
    hasMany,
    hasManyThrough,
    manyToMany,
} from '@adonisjs/lucid/orm'
import ProjectCategory from '#models/project_category'
import ProjectTag from '#models/project_tag'
import TaskList from '#models/task_list'
import ListLine from '#models/list_line'
import TaskAttachment from '#models/task_attachment'

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

    @hasMany(() => TaskList)
    declare lists: HasMany<typeof TaskList>

    @hasManyThrough([() => ListLine, () => TaskList], {
        localKey: 'id',
        foreignKey: 'taskId',
        throughForeignKey: 'listId',
    })
    declare lines: HasManyThrough<typeof ListLine>

    @hasMany(() => TaskAttachment, {
        localKey: 'id',
        foreignKey: 'taskId',
    })
    declare attachments: HasMany<typeof TaskAttachment>

    @column.dateTime()
    declare dueDate: DateTime | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
