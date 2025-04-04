import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'project_invites'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table
                .integer('project_id')
                .unsigned()
                .references('projects.id')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .notNullable()

            table
                .integer('user_id')
                .unsigned()
                .references('users.id')
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
                .nullable()

            table.string('email').notNullable()
            table.string('token').notNullable().unique()

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
