import vine from '@vinejs/vine'

export const CategoryReorderValidation = vine.compile(
    vine.object({
        categories: vine.array(
            vine.object({
                id: vine.number().positive(),
                order: vine.number().positive(),
            })
        ),
    })
)

export const CategoryEditValidation = vine.compile(
    vine.object({
        name: vine.string().maxLength(25).optional(),
        color: vine.string().minLength(7).maxLength(7).optional(),
    })
)
