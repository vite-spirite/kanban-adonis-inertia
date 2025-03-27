import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'project_roles'

    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.boolean('editable').defaultTo(true)
        })
    }

    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('editable')
        })
    }
}
