import transmit from '@adonisjs/transmit/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import ProjectPolicy from '#policies/project_policy'
import Project from '#models/project'

transmit.authorize<{ id: string }>(
    '/projects/:id/categories',
    async ({ auth, bouncer }: HttpContext, { id }) => {
        if (!auth.user) {
            return false
        }

        const project = await Project.query().where('id', +id).first()

        return bouncer.with(ProjectPolicy).allows('read', project)
    }
)

transmit.authorize<{ id: string }>('/user/:id/invites', ({ auth }: HttpContext, { id }) => {
    if (!auth.user) {
        return false
    }

    return auth.user.id === +id
})
