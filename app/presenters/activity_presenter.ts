import { UserPresenter } from '#presenters/user_presenter'
import { ProjectPresenter } from '#presenters/project_presenter'
import Activity from '#models/activity'
import { ActivityDto } from '#types/activity.dto'

export class ActivityPresenter {
    declare id: number
    declare actorId: number
    declare projectId: number
    declare subjectType: string
    declare subjectId: number
    declare type: string

    declare actor?: UserPresenter
    declare project?: ProjectPresenter

    declare createdAt: string
    declare meta: any | null

    constructor(activity: Activity) {
        this.id = activity.id
        this.actorId = activity.actorId
        this.projectId = activity.projectId
        this.subjectType = activity.subjectType
        this.subjectId = activity.subjectId
        this.type = activity.type

        this.actor = undefined

        if (activity.actor) {
            this.actor = new UserPresenter(activity.actor)
        }

        this.project = undefined

        if (activity.project) {
            this.project = new ProjectPresenter(activity.project)
        }

        this.createdAt = activity.createdAt.toString()
        this.meta = activity.meta
    }

    present(): ActivityDto {
        return this
    }
}
