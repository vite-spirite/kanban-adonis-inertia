import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'projects'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.boolean('public').notNullable().defaultTo(false)
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('public')
        })
    }
}
