import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'project_categories'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.string('color').notNullable().defaultTo('#3b82f6')
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('color')
        })
    }
}
