import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'task_attachments'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table
                .integer('task_id')
                .unsigned()
                .references('tasks.id')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')

            table.string('name')
            table.string('path')

            table
                .integer('uploaded_by')
                .unsigned()
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
