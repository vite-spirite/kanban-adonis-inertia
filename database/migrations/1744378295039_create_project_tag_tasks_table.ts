import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'project_tag_tasks'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table
                .integer('task_id')
                .unsigned()
                .references('tasks.id')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .notNullable()
            table
                .integer('tag_id')
                .unsigned()
                .references('project_tags.id')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .notNullable()

            table.integer('order').notNullable().defaultTo(0)

            table.unique(['task_id', 'tag_id'])
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
