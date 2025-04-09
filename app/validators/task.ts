import vine from '@vinejs/vine'

export const TaskReorderValidator = vine.compile(
    vine.object({
        tasks: vine.array(
            vine.object({
                id: vine.number().positive(),
                order: vine.number().positive(),
                categoryId: vine.number().positive(),
            })
        ),
    })
)
