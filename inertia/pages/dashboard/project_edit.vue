<template>
    <Head :title="`Edit ${pageProps.project.name}`" />

    <div class="w-full px-4 py-5">
        <div
            class="rounded-lg overflow-hidden flex flex-row justify-between items-center bg-gray-100"
        >
            <div class="w-full px-4 py-6 rounded-lg">
                <h1 class="font-bold text-xl font-open-sans">{{ pageProps.project.name }}</h1>
            </div>
        </div>

        <TabGroup as="div" class="w-full flex flex-row justify-start items-start pt-12 space-x-12">
            <TabList class="flex flex-col justify-start items-start space-y-2 w-1/6">
                <Tab
                    as="template"
                    v-slot="{ selected }"
                    :disabled="!can(pageProps.capabilities, Permissions.PROJECT_EDIT)"
                >
                    <button
                        class="w-full hover:bg-gray-200 transition-all outline-0 py-4 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="{ 'bg-gray-200': selected, 'bg-transparent': !selected }"
                    >
                        General
                    </button>
                </Tab>

                <Tab as="template" v-slot="{ selected }">
                    <button
                        class="w-full hover:bg-gray-200 transition-all outline-0 py-4 rounded-lg cursor-pointer"
                        :class="{ 'bg-gray-200': selected, 'bg-transparent': !selected }"
                    >
                        Roles
                    </button>
                </Tab>

                <Tab as="template" v-slot="{ selected }">
                    <button
                        class="w-full hover:bg-gray-200 transition-all outline-0 py-4 rounded-lg cursor-pointer"
                        :class="{ 'bg-gray-200': selected, 'bg-transparent': !selected }"
                    >
                        Members
                    </button>
                </Tab>
            </TabList>

            <TabPanels class="flex-1">
                <TabPanel class="w-full">
                    <ProjectEditGeneral :project="pageProps.project" />
                </TabPanel>
                <TabPanel class="w-full">
                    <ProjectEditRole
                        :project="pageProps.project"
                        :capabilities="pageProps.capabilities"
                    />
                </TabPanel>
                <TabPanel class="w-full">Tab 3</TabPanel>
            </TabPanels>
        </TabGroup>
    </div>
</template>

<script lang="ts" setup>
import { usePage, Head, Link } from '@inertiajs/vue3'
import { computed } from 'vue'

import { TabList, TabGroup, Tab, TabPanels, TabPanel } from '@headlessui/vue'

import type { InferPageProps } from '@adonisjs/inertia/types'
import type DashboardController from '#controllers/dashboard_controller'

import { can } from '~/utils/can'
import { Permissions } from '~/utils/permission_enum'

import ProjectEditGeneral from '~/components/projects/editing/general.vue'
import ProjectEditRole from '~/components/projects/editing/role.vue'

const page = usePage<InferPageProps<DashboardController, 'edit'>>()
const pageProps = computed(() => page.props)
</script>
