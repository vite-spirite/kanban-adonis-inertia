import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'tasks'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table
                .integer('category_id')
                .unsigned()
                .references('project_categories.id')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .notNullable()

            table.integer('order').defaultTo(0).notNullable()

            table.string('name').notNullable()
            table.text('description').notNullable()

            table.datetime('due_date').nullable()

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
