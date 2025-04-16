import { UserPresenter } from '#presenters/user_presenter'
import ListLine from '#models/list_line'
import type { ListLineDto } from '#types/list_line.dto'

export class ListLinePresenter {
    declare id: number
    declare name: string
    declare order: number
    declare listId: number
    declare completedAt: string | null
    declare completedBy: UserPresenter | null
    declare updatedAt: string
    declare createdAt: string

    constructor(line: ListLine) {
        this.id = line.id
        this.name = line.name
        this.order = line.order
        this.listId = line.listId
        this.completedAt = line.completedAt ? line.completedAt.toString() : null
        this.completedBy = line.user ? new UserPresenter(line.user) : null
        this.updatedAt = line.updatedAt.toString()
        this.createdAt = line.createdAt.toString()
    }

    present(): ListLineDto {
        return {
            id: this.id,
            name: this.name,
            order: this.order,
            listId: this.listId,
            completedAt: this.completedAt,
            completedBy: this.completedBy ? this.completedBy.present().id : null,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt,
            user: this.completedBy ? this.completedBy.present() : null,
        }
    }
}
