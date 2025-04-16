import vine from '@vinejs/vine'

export const ListCreateValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(1).maxLength(255),
    })
)

export const ListLineCreateValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(1).maxLength(255),
        order: vine.number().positive(),
    })
)
