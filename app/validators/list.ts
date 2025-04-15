import vine from '@vinejs/vine'

export const ListCreateValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(1).maxLength(255),
    })
)
