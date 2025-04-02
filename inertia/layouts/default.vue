<template>
    <div class="w-full min-h-screen bg-gray-50">
        <dashboardNavigation
            v-if="pageProps.user"
            :user="pageProps.user"
            :projects="pageProps.projects"
        />

        <div class="flex flex-1 h-full max-h-screen overflow-auto pb-12">
            <slot />
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
