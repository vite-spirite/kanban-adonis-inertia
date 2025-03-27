import vine from '@vinejs/vine'
import { Permissions } from '#abilities/main'

export const CreateRoleValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3),
    })
)

export const UpdateRoleValidator = vine.compile(
    vine.object({
        permissions: vine.array(
            vine.object({
                name: vine.string().in(Object.values(Permissions)),
                allow: vine.boolean(),
            })
        ),
    })
)
