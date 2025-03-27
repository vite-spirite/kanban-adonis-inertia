<template>
    <div class="w-full flex flex-col justify-start items-start space-y-2">
        <div class="bg-gray-200 rounded-lg px-4 py-6 w-full">
            <h1 class="text-xl font-medium">{{ role.name }}:</h1>
        </div>

        <div
            class="flex flex-col justify-start items-start space-x-2 divide-y divide-gray-200 w-full"
        >
            <div
                class="flex flex-row justify-between items-center w-full p-4"
                v-for="item in Object.values(Permissions)"
                :key="'role_' + role.id + '_permission_' + item"
            >
                <div class="flex flex-col justify-start items-start space-y-2">
                    <h1 class="font-medium text-xl leading-tight text-gray-950">
                        {{ PermissionDescription[item].title }}
                    </h1>
                    <h3 class="font-medium text-gray-700">
                        {{ PermissionDescription[item].description }}
                    </h3>
                </div>

                <Switch
                    :disabled="!role.editable"
                    :default-checked="isChecked(item)"
                    as="template"
                    v-slot="{ checked }"
                    @update:model-value="handleChecked(item)"
                    class="disabled:cursor-not-allowed"
                >
                    <button
                        class="relative inline-flex h-6 w-11 items-center rounded-full"
                        :class="checked ? 'bg-blue-600' : 'bg-gray-200'"
                    >
                        <span class="sr-only">Enable notifications</span>
                        <span
                            :class="checked ? 'translate-x-6' : 'translate-x-1'"
                            class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                        />
                    </button>
                </Switch>
            </div>
        </div>

        <div class="w-full flex flex-row justify-end items-center space-x-2">
            <button
                :disabled="!allowDelete || !role.editable"
                @click.prevent="deleteDialogShow = true"
                class="py-2 px-6 border-red-200 rounded-lg border-2 border-dashed hover:bg-red-500 focus:outline-none hover:border-transparent transition hover:text-gray-50 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Delete role
            </button>

            <button
                :disabled="form.permissions.length <= 0 || !allowEdit || !role.editable"
                @click.prevent="submit"
                class="py-2 px-6 border-gray-200 rounded-lg border-2 border-dashed hover:bg-blue-500 focus:outline-none hover:border-transparent transition hover:text-gray-50 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Save changes
            </button>
        </div>
    </div>

    <Dialog
        :open="deleteDialogShow"
        @close="deleteDialogShow = !deleteDialogShow"
        class="relative z-50"
    >
        <div class="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/30">
            <DialogPanel
                class="w-full max-w-sm rounded bg-white p-4 flex flex-col justify-start items-start space-y-2"
            >
                <DialogTitle class="text-xl">Delete {{ role.name }}:</DialogTitle>

                <p>
                    Are you sure you want to delete the role {{ role.name }}? This action cannot be
                    undone.
                </p>

                <div class="flex flex-row justify-end items-center space-x-2 w-full">
                    <button
                        class="bg-red-500 text-gray-100 font-medium hover:bg-red-400 hover:text-gray-50 cursor-pointer px-4 py-2 rounded-md transition"
                        @click.prevent="submitDelete"
                    >
                        Delete
                    </button>
                    <button
                        class="bg-blue-500 text-gray-100 font-medium hover:bg-blue-400 hover:text-gray-50 cursor-pointer px-4 py-2 rounded-md transition"
                        @click="deleteDialogShow = !deleteDialogShow"
                    >
                        Cancel
                    </button>
                </div>
            </DialogPanel>
        </div>
    </Dialog>
</template>

<script lang="ts" setup>
import type { RoleDto } from '#types/role.dto'
import { useForm } from '@inertiajs/vue3'
import { Permissions } from '~/utils/permission_enum'
import { PermissionDescription } from '~/utils/permission_description'
import { Dialog, DialogPanel, DialogTitle, Switch } from '@headlessui/vue'
import { ref } from 'vue'

const deleteDialogShow = ref(false)
const { role, projectId, allowDelete } = defineProps<{
    role: RoleDto
    projectId: number
    allowEdit: boolean
    allowDelete: boolean
}>()

const form = useForm<{ permissions: { name: string; allow: boolean }[] }>({ permissions: [] })
const deleteFrom = useForm<{}>({})

const handleChecked = (name: string) => {
    if (!role.editable) return

    const updated = form.permissions.find((p) => p.name == name)

    if (updated) {
        updated.allow = !updated.allow
        return
    }

    if (!role.permissions) {
        return
    }

    const defaultAllow = role.permissions.find((p) => p.name == name)

    if (!defaultAllow) {
        form.permissions.push({
            name: name,
            allow: true,
        })

        return
    }

    form.permissions.push({
        name: name,
        allow: !defaultAllow.allow,
    })
}

const isChecked = (name: string) => {
    let permission = form.permissions.find((p) => p.name == name)

    if (!permission) {
        if (role.permissions) {
            permission = role.permissions.find((p) => p.name == name)
        }
    }

    if (!permission) {
        return false
    }

    return permission.allow
}

const submit = () => {
    form.put(`/dashboard/projects/${projectId}/role/${role.id}`, {
        onSuccess: () => {
            form.reset()
        },
    })
}

const submitDelete = () => {
    if (allowDelete) {
        deleteFrom.delete(`/dashboard/projects/${projectId}/role/${role.id}`)
    }
}
</script>
