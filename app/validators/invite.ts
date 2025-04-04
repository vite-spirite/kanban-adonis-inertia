import vine from '@vinejs/vine'

export const CreateInviteValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        roles: vine.array(
            vine.object({
                id: vine.number().positive(),
                allow: vine.boolean(),
            })
        ),
    })
)
