import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'list_lines'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.string('name').notNullable()
            table
                .integer('list_id')
                .unsigned()
                .references('task_lists.id')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .notNullable()

            table.integer('order').notNullable().defaultTo(0)

            table.timestamp('completed_at').nullable().defaultTo(null)
            table
                .integer('completed_by')
                .unsigned()
                .nullable()
                .references('users.id')
                .onDelete('SET NULL')
                .onUpdate('CASCADE')

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
