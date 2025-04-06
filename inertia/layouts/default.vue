<template>
    <div class="w-full min-h-screen bg-gray-50 flex flex-col">
        <dashboardNavigation
            v-if="pageProps.user"
            :user="pageProps.user"
            :projects="pageProps.projects"
        />

        <div class="flex flex-1 h-full overflow-auto">
            <slot class="h-full" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { SharedProps } from '@adonisjs/inertia/types'
import { usePage } from '@inertiajs/vue3'
import dashboardNavigation from '~/components/dashboard_navigation.vue'
import { computed } from 'vue'

const page = usePage<SharedProps & { [key: string]: any }>()
const pageProps = computed(() => page.props)

console.log(pageProps.value.projects)
</script>
