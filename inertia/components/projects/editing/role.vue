<template>
    <div class="w-full">
        <TabGroup as="div" class="w-full flex flex-row justify-start items-start space-x-12">
            <TabList class="flex flex-col justify-start items-start space-y-2 w-1/4 xl:w-1/8">
                <Tab
                    as="template"
                    v-slot="{ selected }"
                    :disabled="
                        !can(capabilities, Permissions.PROJECT_ROLE_EDIT) &&
                        !can(capabilities, Permissions.PROJECT_ROLE_DELETE)
                    "
                    v-for="role in project.roles"
                    :key="role.id"
                >
                    <button
                        class="w-full hover:bg-gray-200 transition-all outline-0 py-4 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="{ 'bg-gray-200': selected, 'bg-transparent': !selected }"
                    >
                        {{ role.name }}
                    </button>
                </Tab>

                <Tab
                    as="template"
                    v-slot="{ selected }"
                    :disabled="!can(capabilities, Permissions.PROJECT_ROLE_CREATE)"
                >
                    <button
                        class="inline-flex flex-row justify-center items-center space-x-2 w-full outline-none border-2 border-dashed border-gray-200 text-center hover:bg-blue-500 rounded-lg p-2 hover:text-gray-200 hover:border-transparent transition cursor-pointer disabled:opacity-50"
                        :class="{
                            'bg-blue-500 border-transparent text-white': selected,
                            'bg-transparent': !selected,
                        }"
                    >
                        <PlusCircleIcon class="w-4 h-4" />
                        <span>Create new role</span>
                    </button>
                </Tab>
            </TabList>

            <TabPanels class="flex-1">
                <TabPanel
                    v-for="role in project.roles"
                    :key="'role_panel_' + role.id"
                    class="w-full"
                >
                    <ProjectRoleEditPermission
                        :role="role"
                        :project-id="project.id"
                        :allow-delete="can(capabilities, Permissions.PROJECT_ROLE_DELETE)"
                        :allow-edit="can(capabilities, Permissions.PROJECT_ROLE_EDIT)"
                    />
                </TabPanel>

                <TabPanel class="w-full flex flex-col justify-start items-start space-y-4">
                    <div class="bg-gray-200 rounded-lg px-4 py-6 w-full">
                        <h1 class="text-xl font-medium">Create role:</h1>
                    </div>

                    <form
                        class="flex flex-col space-y-2 w-1/4 mx-auto border-2 border-gray-100 rounded-lg p-4"
                        @submit.prevent="createRole"
                    >
                        <div class="flex flex-col space-y-2 w-full">
                            <label for="roleName">Role name:</label>
                            <input
                                v-model="createRoleForm.name"
                                type="text"
                                id="roleName"
                                name="roleName"
                                class="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition"
                            />
                        </div>

                        <div class="w-full text-right">
                            <button
                                type="submit"
                                class="inline-flex items-center px-4 py-2 font-medium text-gray-950 bg-gray-200 hover:bg-green-500 hover:text-gray-50 transition rounded-lg cursor-pointer"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </TabPanel>
            </TabPanels>
        </TabGroup>
    </div>
</template>

<script lang="ts" setup>
import type { ProjectDto } from '#types/project.dto'
import type { PermissionDto } from '#types/permission.dto'
import { can } from '~/utils/can'
import { Permissions } from '~/utils/permission_enum'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { PlusCircleIcon } from '@heroicons/vue/24/outline'
import { useForm } from '@inertiajs/vue3'

import ProjectRoleEditPermission from './permission.vue'

const { project, capabilities } = defineProps<{
    project: ProjectDto
    capabilities: PermissionDto[]
}>()

const createRoleForm = useForm({
    name: '',
})

const createRole = () => {
    createRoleForm.post(`/dashboard/projects/${project.id}/role`)
}
</script>
