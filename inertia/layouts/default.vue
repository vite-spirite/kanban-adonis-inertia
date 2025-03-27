<template>
    <div class="w-full min-h-screen bg-gray-50 flex flex-row justify-start items-start">
        <sidenav v-if="pageProps.user" :user="pageProps.user" :projects="pageProps.projects" />
        <div class="flex flex-1 max-h-screen overflow-auto">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { SharedProps } from '@adonisjs/inertia/types'
import { usePage } from '@inertiajs/vue3'
import sidenav from '~/components/sidenav.vue'
import { computed } from 'vue'

const page = usePage<SharedProps & { [key: string]: any }>()
const pageProps = computed(() => page.props)
</script>
