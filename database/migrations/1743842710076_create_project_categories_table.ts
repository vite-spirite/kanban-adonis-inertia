import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'project_categories'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table
                .integer('project_id')
                .unsigned()
                .notNullable()
                .references('projects.id')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')

            table.string('name').notNullable()
            table.integer('order').defaultTo(0).notNullable()

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
