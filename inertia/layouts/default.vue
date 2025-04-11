<template>
    <div class="w-full min-h-screen max-h-screen h-screen bg-gray-50 flex flex-col">
        <dashboardNavigation
            v-if="pageProps.user"
            :user="pageProps.user"
            :projects="pageProps.projects"
        />

        <div class="w-full h-full max-w-screen overflow-auto flex flex-1">
            <slot class="h-full" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { SharedProps } from '@adonisjs/inertia/types'
import { usePage } from '@inertiajs/vue3'
import dashboardNavigation from '~/components/dashboard_navigation.vue'
import { computed, onBeforeMount, onBeforeUnmount, onMounted } from 'vue'
import { transmit } from '~/utils/transmit'

const page = usePage<SharedProps & { [key: string]: any }>()
const pageProps = computed(() => page.props)

onBeforeMount(() => {
    transmit.createInstance(window.location.origin)
})
</script>
