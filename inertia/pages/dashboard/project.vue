<template>
    <Head :title="pageProps.project.name" />

    <div class="w-full px-4 py-5">
        <div class="w-full px-4 py-6 rounded-lg bg-gray-100">
            <h1 class="font-bold text-xl font-open-sans">{{ pageProps.project.name }}</h1>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { usePage, Head } from '@inertiajs/vue3'
import { computed } from 'vue'
import type { InferPageProps } from '@adonisjs/inertia/types'
import type DashboardController from '#controllers/dashboard_controller'

const page = usePage<InferPageProps<DashboardController, 'project'>>()
const pageProps = computed(() => page.props)
</script>
