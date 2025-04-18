import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'activities'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.integer('project_id').unsigned().references('projects.id').notNullable()
            table.integer('actor_id').unsigned().references('users.id').notNullable()

            table.string('subject_type').unsigned().notNullable()
            table.integer('subject_id').unsigned().notNullable()

            table.string('type').unsigned().notNullable()
            table.json('meta')

            table.timestamp('created_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
