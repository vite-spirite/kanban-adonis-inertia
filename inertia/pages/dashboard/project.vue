<template>
    <Head :title="pageProps.project.name" />

    <div class="w-full">
        <ProjectHeader :project="pageProps.project" :capabilities="pageProps.capabilities" />
    </div>
</template>

<script lang="ts" setup>
import { usePage, Head } from '@inertiajs/vue3'
import { computed } from 'vue'
import type { InferPageProps } from '@adonisjs/inertia/types'
import type DashboardController from '#controllers/dashboard_controller'

import ProjectHeader from '~/components/projects/header.vue'

const page = usePage<InferPageProps<DashboardController, 'project'>>()
const pageProps = computed(() => page.props)

console.log(pageProps.value)
</script>
