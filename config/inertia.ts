import type { UserPresenter } from '#types/user.dto'
import type { MinimalProject } from '#types/project.dto'
import type { InferSharedProps } from '@adonisjs/inertia/types'

import { defineConfig } from '@adonisjs/inertia'
import { ProjectService } from '#services/project_service'

const inertiaConfig = defineConfig({
    /**
     * Path to the Edge view that will be used as the root view for Inertia responses
     */
    rootView: 'inertia_layout',

    /**
     * Data that should be shared with all rendered pages
     */
    sharedData: {
        user: (ctx) => ctx.inertia.always(() => ctx.auth.user),
        projects: (ctx) =>
            ctx.inertia.optional(() => {
                console.log('reload projects data')
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
        user: UserPresenter | null
        projects: MinimalProject[]
    }
}
