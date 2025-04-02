<template>
    <div class="w-full border-b-2 border-gray-200 h-[56px] relative">
        <div class="flex flex-row justify-between items-center h-full w-full">
            <Link
                href="/"
                class="relative z-10 border-r-2 border-gray-200 h-full flex flex-row justify-start items-center px-4"
            >
                <img src="/public/logo.svg" alt="logo" />
            </Link>

            <UserDropdown class="relative z-10 h-full border-l-2 border-gray-200" :user="user" />
        </div>

        <div class="absolute top-0 left-0 w-full h-full flex flex-row justify-center items-center">
            <ProjectDropdown :projects="projects" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { MinimalProjectDto } from '#types/project.dto'
import type { MeDto } from '#types/user.dto'

import { Link } from '@inertiajs/vue3'
import UserDropdown from '~/components/navigation/user_dropdown.vue'
import ProjectDropdown from '~/components/navigation/project_dropdown.vue'

const { projects, user } = defineProps<{ projects: MinimalProjectDto[]; user: MeDto }>()
</script>
