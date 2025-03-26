import type { MinimalProjectDto } from '#types/project.dto'
import type { MeDto } from '#types/user.dto'
import type { InferSharedProps } from '@adonisjs/inertia/types'

import { defineConfig } from '@adonisjs/inertia'
import { ProjectService } from '#services/project_service'

import { UserPresenter } from '#presenters/user_presenter'

const inertiaConfig = defineConfig({
    /**
     * Path to the Edge view that will be used as the root view for Inertia responses
     */
    rootView: 'inertia_layout',

    /**
     * Data that should be shared with all rendered pages
     */
    sharedData: {
        user: (ctx) =>
            ctx.inertia.always(() => {
                if (ctx.auth.user) {
                    return new UserPresenter(ctx.auth.user).presentMe()
                } else {
                    return null
                }
            }),
        projects: (ctx) =>
            ctx.inertia.optional(() => {
                if (ctx.auth.user) {
                    const projectService = new ProjectService()
                    return projectService.getMinimalUserProjects(ctx.auth.user)
                } else {
                    return []
                }
            }),
    },

    /**
     * Options for the server-side rendering
     */
    ssr: {
        enabled: true,
        entrypoint: 'inertia/app/ssr.ts',
    },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
    export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {
        user: MeDto | null
        projects: MinimalProjectDto[]
    }
}
