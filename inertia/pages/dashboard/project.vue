<template>
    <Head :title="pageProps.project.name" />

    <div class="w-full px-4 py-5">
        <div
            class="rounded-lg overflow-hidden flex flex-row justify-between items-center bg-gray-100"
        >
            <div class="w-full px-4 py-6 rounded-lg">
                <h1 class="font-bold text-xl font-open-sans">{{ pageProps.project.name }}</h1>
            </div>

            <div class="px-4 py-6">
                <Link href="/" v-if="can(pageProps.capabilities, Permissions.PROJECT_EDIT)"
                    >Edit</Link
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { usePage, Head, Link } from '@inertiajs/vue3'
import { computed } from 'vue'
import { can } from '~/utils/can'
import { Permissions } from '#policies/main'
import type { InferPageProps } from '@adonisjs/inertia/types'
import type DashboardController from '#controllers/dashboard_controller'

const page = usePage<InferPageProps<DashboardController, 'project'>>()
const pageProps = computed(() => page.props)

console.log(pageProps.value)
</script>
