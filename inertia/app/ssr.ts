import { createInertiaApp } from '@inertiajs/vue3'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, type DefineComponent, h } from 'vue'
import Layout from '~/layouts/default.vue'

export default function render(page: any) {
    return createInertiaApp({
        page,
        render: renderToString,
        resolve: (name) => {
            const pages = import.meta.glob<DefineComponent>('../pages/**/*.vue', { eager: true })
            const resolvedPage = pages[`../pages/${name}.vue`]

            if (name.startsWith('dashboard')) {
                resolvedPage.default.layout = Layout
            }

            return resolvedPage
        },

        setup({ App, props, plugin }) {
            return createSSRApp({ render: () => h(App, props) }).use(plugin)
        },
    })
}
