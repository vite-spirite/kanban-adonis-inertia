<template>
    <Head title="Edit project" />

    <div class="w-full h-full">
        <ProjectHeader :project="pageProps.project" :capabilities="pageProps.capabilities" />
    </div>
</template>

<script lang="ts" setup>
import type { InferPageProps } from '@adonisjs/inertia/types'
import type DashboardController from '#controllers/dashboard_controller'

import { Head, usePage } from '@inertiajs/vue3'
import ProjectHeader from '~/components/projects/header.vue'
import { computed } from 'vue'

const page = usePage<InferPageProps<DashboardController, 'members'>>()
const pageProps = computed(() => page.props)
</script>
