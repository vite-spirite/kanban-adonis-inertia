<template>
    <div class="w-full bg-bray-200 bg-gray-100 relative">
        <div
            class="max-w-screen-2xl w-full flex flex-col justify-center items-start space-y-4 mx-auto py-12 2xl:px-0 px-4"
        >
            <Link
                class="inline-flex flex-row justify-start items-start space-x-2 font-medium font-roboto text-sm text-gray-500 hover:text-gray-900 transition"
                href="/dashboard"
            >
                <ArrowLeftIcon class="size-4" />
                <span>Back to projects</span>
            </Link>

            <div class="flex flex-row justify-start items-center space-x-2">
                <img
                    v-if="project.image"
                    :src="project.image"
                    :alt="project.name"
                    class="size-8 rounded-lg"
                />

                <h1 class="font-bold text-2xl font-open-sans">{{ project.name }}</h1>
            </div>
        </div>

        <div class="w-full h-[2px] bg-gray-200"></div>

        <div
            class="max-w-screen-2xl w-full flex flex-row justify-start items-center space-x-6 mx-auto relative z-10 2xl:px-0 px-4"
        >
            <Link
                class="inline-flex flex-row justify-start items-start space-x-2 font-medium font-roboto text-sm text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900 transition py-4 px-2 relative z-10"
                :href="`/dashboard/projects/${project.id}`"
                :class="{
                    '!border-gray-900 !text-gray-900': $page.component === 'dashboard/project',
                }"
            >
                <QueueListIcon class="size-4" />
                <span>Board</span>
            </Link>

            <Link
                v-if="can(capabilities, Permissions.PROJECT_EDIT)"
                class="inline-flex flex-row justify-start items-start space-x-2 font-medium font-roboto text-sm text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900 transition py-4 px-2 relative z-10"
                :href="`/dashboard/projects/${project.id}/edit`"
                :class="{
                    '!border-gray-900 !text-gray-900':
                        $page.component === 'dashboard/project/editing/general',
                }"
            >
                <Cog6ToothIcon class="size-4" />
                <span>Settings</span>
            </Link>

            <Link
                v-if="
                    can(capabilities, Permissions.PROJECT_ROLE_CREATE) ||
                    can(capabilities, Permissions.PROJECT_ROLE_EDIT) ||
                    can(capabilities, Permissions.PROJECT_ROLE_DELETE)
                "
                class="inline-flex flex-row justify-start items-start space-x-2 font-medium font-roboto text-sm text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900 transition py-4 px-2 relative z-10"
                :href="`/dashboard/projects/${project.id}/edit/roles`"
                :class="{
                    '!border-gray-900 !text-gray-900':
                        $page.component === 'dashboard/project/editing/roles',
                }"
            >
                <ShieldCheckIcon class="size-4" />
                <span>Roles</span>
            </Link>

            <Link
                v-if="
                    can(capabilities, Permissions.PROJECT_MEMBER_CREATE) ||
                    can(capabilities, Permissions.PROJECT_MEMBER_EDIT) ||
                    can(capabilities, Permissions.PROJECT_MEMBER_DELETE)
                "
                class="inline-flex flex-row justify-start items-start space-x-2 font-medium font-roboto text-sm text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900 transition py-4 px-2 relative z-10"
                :href="`/dashboard/projects/${project.id}/edit/members`"
                :class="{
                    '!border-gray-900 !text-gray-900':
                        $page.component === 'dashboard/project/editing/members',
                }"
            >
                <UserGroupIcon class="size-4" />
                <span>Members</span>
            </Link>
        </div>

        <div class="w-full h-[2px] bg-gray-200 absolute left-0 bottom-0"></div>
    </div>
</template>

<script lang="ts" setup>
import type { ProjectDto } from '#types/project.dto'
import type { PermissionDto } from '#types/permission.dto'

import { Permissions } from '~/utils/permission_enum'
import { Link } from '@inertiajs/vue3'
import {
    ArrowLeftIcon,
    Cog6ToothIcon,
    QueueListIcon,
    ShieldCheckIcon,
    UserGroupIcon,
} from '@heroicons/vue/24/solid'
import { can } from '~/utils/can'

const { project } = defineProps<{ project: ProjectDto; capabilities: PermissionDto[] }>()
</script>
