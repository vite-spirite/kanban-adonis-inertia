import vine from '@vinejs/vine'

export const TagCreateValidator = vine.compile(
    vine.object({
        name: vine.string().maxLength(255).minLength(1),
        color: vine.string().maxLength(7).minLength(7),
    })
)

export const TagUpdateValidator = vine.compile(
    vine.object({
        id: vine.number().positive(),
        name: vine.string().maxLength(255).minLength(1).optional(),
        color: vine.string().maxLength(7).minLength(7).optional(),
    })
)
