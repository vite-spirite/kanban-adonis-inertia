import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'task_lists'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table
                .integer('task_id')
                .unsigned()
                .notNullable()
                .references('tasks.id')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')

            table.string('name').notNullable()

            table.timestamp('created_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
