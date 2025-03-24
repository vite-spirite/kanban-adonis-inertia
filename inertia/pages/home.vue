<template>
    <Head title="Kanban Board" />

    <div class="min-h-screen w-full">
        <Navigation />
        <div class="flex justify-center items-center h-full">
            <h1 class="text-4xl font-bold">Welcome to Kanban Board</h1>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Head } from '@inertiajs/vue3'

import Navigation from '~/components/nav.vue'
</script>
