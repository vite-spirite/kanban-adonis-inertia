<template>
    <Head title="Edit project" />

    <div class="w-full h-full">
        <ProjectHeader :project="pageProps.project" :capabilities="pageProps.capabilities" />
        <ProjectAddMember
            :roles="pageProps.project.roles ?? []"
            :is-open="isOpen"
            @close="isOpen = false"
            :project-id="pageProps.project.id"
        />
        <div
            class="py-12 2xl:px-0 px-4 max-w-screen-2xl mx-auto flex flex-col justify-start items-start space-y-6"
        >
            <div class="w-full text-left">
                <button
                    class="py-2 px-4 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-sm font-medium transition-all cursor-pointer"
                    @click.prevent="isOpen = true"
                >
                    Add member
                </button>
            </div>

            <h2 class="text-2xl font-semibold text-gray-800">Members</h2>

            <div class="w-full grid grid-cols-3 gap-4">
                <ProjectMemberEdit
                    v-for="user in pageProps.project.users"
                    :user="user"
                    :capabilities="pageProps.capabilities"
                    :roles="pageProps.project.roles || []"
                    :project="pageProps.project"
                    :key="`project_${pageProps.project.id}_user_${user.id}`"
                />
            </div>

            <h2
                v-if="pageProps.project.invites.length > 0"
                class="text-2xl font-semibold text-gray-800"
            >
                Invites
            </h2>

            <div class="w-full grid grid-cols-3 gap-4">
                <ProjectInviteEdit
                    v-for="invite in pageProps.project.invites"
                    :key="`project_${pageProps.project.id}_invite_${invite.id}`"
                    :invite="invite"
                    :roles="pageProps.project.roles || []"
                    :allow-remove="can(pageProps.capabilities, Permissions.PROJECT_MEMBER_DELETE)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { InferPageProps } from '@adonisjs/inertia/types'
import type DashboardController from '#controllers/dashboard_controller'

import { Head, usePage } from '@inertiajs/vue3'
import ProjectHeader from '~/components/projects/header.vue'
import { computed, ref } from 'vue'

import ProjectAddMember from '~/components/projects/editing/add_member_dialog.vue'
import ProjectMemberEdit from '~/components/projects/editing/member.vue'
import ProjectInviteEdit from '~/components/projects/editing/invite.vue'
import { Permissions } from '~/utils/permission_enum'
import { can } from '~/utils/can'

const page = usePage<InferPageProps<DashboardController, 'members'>>()
const pageProps = computed(() => page.props)

const isOpen = ref(false)
</script>
