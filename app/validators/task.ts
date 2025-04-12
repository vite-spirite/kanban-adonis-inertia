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

export const TaskCreateValidator = vine.compile(
    vine.object({
        name: vine.string().maxLength(255).minLength(1),
        description: vine.string(),
        order: vine.number().positive(),
        dueDate: vine.string().optional(),
        categoryId: vine.number().positive(),
    })
)

export const TaskTagEditingValidator = vine.compile(
    vine.object({
        tags: vine.array(
            vine.object({
                id: vine.number().positive(),
                order: vine.number().positive(),
            })
        ),
    })
)

export const TaskUpdateValidator = vine.compile(
    vine.object({
        name: vine.string().maxLength(255).minLength(1).optional(),
        description: vine.string().optional(),
        dueDate: vine.string().optional(),
    })
)
