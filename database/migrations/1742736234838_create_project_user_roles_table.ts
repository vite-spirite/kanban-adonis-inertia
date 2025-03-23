import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'project_user_roles'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.integer('user_id').unsigned().references('users.id')
            table.integer('role_id').unsigned().references('project_roles.id')

            table.unique(['user_id', 'role_id'])

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
