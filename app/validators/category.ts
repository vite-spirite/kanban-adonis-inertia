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
