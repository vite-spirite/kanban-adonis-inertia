import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'remeber_tokens'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table
                .integer('tokenable_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE')

            table.string('hash').notNullable().unique()
            table.timestamp('created_at').notNullable()
            table.timestamp('updated_at').notNullable()
            table.timestamp('expired_at').notNullable()
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
