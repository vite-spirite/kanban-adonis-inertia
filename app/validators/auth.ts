import vine from '@vinejs/vine'

export const RegisterValidator = vine.compile(
    vine.object({
        fullName: vine.string().unique(async (db, value) => {
            const user = await db.from('users').where('full_name', value).first()

            return !user
        }),
        email: vine
            .string()
            .email()
            .unique(async (db, value) => {
                const user = await db.from('users').where('email', value).first()

                return !user
            }),
        password: vine.string().minLength(8).confirmed(),
    })
)

export const LoginValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(8),
        rememberMe: vine.boolean().optional(),
    })
)
