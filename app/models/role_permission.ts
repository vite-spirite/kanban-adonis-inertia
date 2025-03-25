import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import ProjectRole from '#models/project_role'

export default class RolePermission extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare roleId: number

    @column()
    declare permission: string

    @column()
    declare allow: boolean

    @belongsTo(() => ProjectRole, { foreignKey: 'roleId' })
    declare role: BelongsTo<typeof ProjectRole>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
