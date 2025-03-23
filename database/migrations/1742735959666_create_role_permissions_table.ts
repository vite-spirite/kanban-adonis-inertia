import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'role_permissions'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table
                .integer('role_id')
                .unsigned()
                .references('id')
                .inTable('project_roles')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')

            table.string('permission').notNullable()
            table.boolean('allow').defaultTo(false)

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
