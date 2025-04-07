import ProjectCategory from '#models/project_category'
import type { CategoryDto } from '#types/category.dto'

export class CategoryPresenter {
    declare id: number
    declare projectId: number
    declare name: string
    declare order: number
    declare color: string

    constructor(category: ProjectCategory) {
        this.id = category.id
        this.projectId = category.projectId
        this.name = category.name
        this.order = category.order
        this.color = category.color
    }

    present(): CategoryDto {
        return {
            id: this.id,
            projectId: this.projectId,
            name: this.name,
            order: this.order,
            color: this.color,
        }
    }
}
