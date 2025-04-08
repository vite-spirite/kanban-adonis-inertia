import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'project_tags'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.string('name').notNullable()
            table
                .integer('project_id')
                .unsigned()
                .references('projects.id')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')

            table.string('color').notNullable().defaultTo('#3b82f6')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
