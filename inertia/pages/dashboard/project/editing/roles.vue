<template>
    <Head title="Edit project" />

    <div class="w-full h-full">
        <ProjectHeader :project="pageProps.project" :capabilities="pageProps.capabilities" />

        <div class="py-12 2xl:px-0 px-4">
            <div class="max-w-screen-2xl mx-auto">
                <h2 class="text-2xl font-semibold text-gray-800">Roles</h2>

                <div class="w-full py-2">
                    <TabGroup as="div" class="flex flex-row justify-start items-stretch space-x-4">
                        <TabList class="flex flex-col items-start justify-start w-1/6 relative">
                            <Tab
                                v-for="role in pageProps.project.roles"
                                :key="`project_${pageProps.project.id}_role_tab_item_${role.id}`"
                                as="template"
                                v-slot="{ selected }"
                            >
                                <button
                                    class="w-full inline-block text-neutral-900 p-2 outline-none transition cursor-pointer hover:bg-gray-100 relative z-10 border-r-2 py-2 text-left rounded-l-lg"
                                    :class="{
                                        'border-neutral-900': selected,
                                        'border-transparent': !selected,
                                    }"
                                >
                                    {{ role.name }}
                                </button>
                            </Tab>

                            <div class="absolute top-0 right-0 w-[2px] h-full bg-gray-200"></div>
                        </TabList>

                        <TabPanels as="div" class="flex-1">
                            <TabPanel
                                class="h-full"
                                v-for="role in pageProps.project.roles"
                                :key="`project_${pageProps.project.id}_role_tab_panel_${role.id}`"
                            >
                                <ProjectPermissionEdit
                                    :role="role"
                                    :project-id="pageProps.project.id"
                                    :allow-edit="
                                        can(pageProps.capabilities, Permissions.PROJECT_ROLE_EDIT)
                                    "
                                    :allow-delete="
                                        can(pageProps.capabilities, Permissions.PROJECT_ROLE_DELETE)
                                    "
                                />
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { InferPageProps } from '@adonisjs/inertia/types'
import type DashboardController from '#controllers/dashboard_controller'

import { Head, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'

import { can } from '~/utils/can'
import { Permissions } from '~/utils/permission_enum'

import ProjectHeader from '~/components/projects/header.vue'
import ProjectPermissionEdit from '~/components/projects/editing/permission.vue'

const page = usePage<InferPageProps<DashboardController, 'roles'>>()
const pageProps = computed(() => page.props)
</script>
