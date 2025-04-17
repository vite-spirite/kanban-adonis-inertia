import vine from '@vinejs/vine'

export const projectEdit = vine.compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(255),
        image: vine
            .file({
                size: '2mb',
                extnames: ['jpg', 'jpeg', 'png'],
            })
            .optional(),
        public: vine.boolean().optional(),
    })
)
