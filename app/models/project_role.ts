import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'
import RolePermission from '#models/role_permission'
import User from '#models/user'

export default class ProjectRole extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare projectId: number

    @column()
    declare name: string

    @belongsTo(() => Project)
    declare project: BelongsTo<typeof Project>

    @hasMany(() => RolePermission, { localKey: 'id', foreignKey: 'roleId' })
    declare permissions: HasMany<typeof RolePermission>

    @manyToMany(() => User, {
        localKey: 'id',
        pivotForeignKey: 'role_id',
        relatedKey: 'id',
        pivotRelatedForeignKey: 'user_id',
        pivotTable: 'project_user_roles',
    })
    declare users: ManyToMany<typeof User>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
