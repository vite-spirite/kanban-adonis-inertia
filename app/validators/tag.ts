import vine from '@vinejs/vine'

export const TagCreateValidator = vine.compile(
    vine.object({
        name: vine.string().maxLength(255).minLength(1),
        color: vine.string().maxLength(7).minLength(7),
    })
)
