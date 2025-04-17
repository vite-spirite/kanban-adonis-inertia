import vine from '@vinejs/vine'

export const AttachmentCreateValidator = vine.compile(
    vine.object({
        file: vine.file({ size: '10mb' }),
    })
)
