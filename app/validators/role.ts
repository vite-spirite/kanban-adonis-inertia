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

export const UpdateUserRoleValidator = vine.compile(
    vine.object({
        user_id: vine.number(),
        roles: vine.array(
            vine.object({
                id: vine.number(),
                allow: vine.boolean(),
            })
        ),
    })
)
