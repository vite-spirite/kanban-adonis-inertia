import { UserPresenter } from '#presenters/user_presenter'
import TaskAttachment from '#models/task_attachment'
import router from '@adonisjs/core/services/router'
import { AttachmentDto } from '#types/attachment.dto'

export class TaskAttachmentPresenter {
    declare id: number
    declare name: string
    declare path: string
    declare taskId: number
    declare uploadedBy: number
    declare uploader?: UserPresenter
    declare createdAt: string
    declare updatedAt: string

    declare url: string

    constructor(attachment: TaskAttachment) {
        this.id = attachment.id
        this.name = attachment.name
        this.path = attachment.path
        this.taskId = attachment.taskId
        this.uploadedBy = attachment.uploadedBy
        this.createdAt = attachment.createdAt.toString() || ''
        this.updatedAt = attachment.updatedAt.toString() || ''

        this.uploader = attachment.uploader ? new UserPresenter(attachment.uploader) : undefined

        this.url = router
            .builder()
            .params({ attachmentId: this.id })
            .make('dashboard.download.attachment')
    }

    present(): AttachmentDto {
        return {
            ...this,
            uploader: this.uploader ? this.uploader.present() : undefined,
        }
    }
}
