<template>
    <div class="w-full">
        <RoleDeleteConfirmDialog
            :is-open="dialogDelete"
            @close="dialogDelete = false"
            :role-id="role.id"
            :project-id="projectId"
        />

        <div class="h-full flex flex-row justify-between items-center">
            <h2 class="text-2xl font-semibold text-gray-800">{{ role.name }}</h2>

            <div class="flex flex-row justify-end items-center space-x-4">
                <button
                    :disabled="!allowDelete || !role.editable"
                    @click="dialogDelete = true"
                    class="font-medium bg-red-400 hover:bg-red-600 transition text-gray-100 rounded-lg p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <TrashIcon class="size-4" />
                </button>

                <button
                    :disabled="!isFormChanged || !role.editable || !allowEdit"
                    @click="submit"
                    class="font-medium bg-green-400 hover:bg-green-600 transition text-gray-100 rounded-lg p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <CheckIcon class="size-4" />
                </button>
            </div>
        </div>

        <!--<div class="h-[2px] w-full bg-gray-200 block my-4"></div>-->

        <div class="flex flex-col justify-start items-start w-full pt-6 divide-y divide-gray-200">
            <div
                class="flex flex-row justify-between items-center py-4 w-full"
                v-for="(permission, index) in permissionForm.permissions"
                :key="`role_${role.id}_permission_${permission.name}`"
            >
                <div class="flex flex-col justify-start items-start space-y-2">
                    <h1 class="text-xl text-neutral-900">
                        {{ PermissionDescription[permission.name].title }}
                    </h1>

                    <span class="text-md text-neutral-500">
                        {{ PermissionDescription[permission.name].description }}
                    </span>
                </div>

                <Switch
                    v-model="permission.allow"
                    :disabled="!role.editable"
                    :class="permission.allow ? 'bg-green-500' : 'bg-gray-200'"
                    class="relative inline-flex h-6 w-11 items-center rounded-full"
                >
                    <span
                        :class="permission.allow ? 'translate-x-6' : 'translate-x-1'"
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    />
                </Switch>
            </div>
        </div>

        <div class="flex flex-row justify-end items-center w-full">
            <button
                :disabled="!isFormChanged || !role.editable || !allowEdit"
                class="text-sm font-medium bg-green-100 hover:bg-green-200 text-green-900 rounded-lg px-4 py-2 cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-50"
                @click="submit"
            >
                <span>Save role</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { RoleDto } from '#types/role.dto'
import { ref, toRaw, watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { Permissions } from '~/utils/permission_enum'
import { PermissionDescription } from '~/utils/permission_description'

import { Switch } from '@headlessui/vue'
import { CheckIcon, TrashIcon } from '@heroicons/vue/24/solid'
import RoleDeleteConfirmDialog from '~/components/projects/editing/role_delete_confirm_dialog.vue'

const { role, projectId } = defineProps<{
    role: RoleDto
    projectId: number
    allowDelete: boolean
    allowEdit: boolean
}>()

const dialogDelete = ref(false)

const permissionForm = useForm<{ permissions: { name: string; allow: boolean }[] }>({
    permissions: [],
})
const baseFormValue = ref<{ name: string; allow: boolean }[]>([])
const isFormChanged = ref(false)

const getRolePermissionByName = (name: Permissions | string) => {
    const permission = role.permissions?.find((perm) => perm.name == name)
    return permission
}

const initialValue = () => {
    baseFormValue.value = []
    permissionForm.permissions = []

    Object.values(Permissions).forEach((permission) => {
        const baseValue = getRolePermissionByName(permission)

        permissionForm.permissions.push({
            name: permission,
            allow: baseValue.allow ?? false,
        })

        baseFormValue.value.push({
            name: permission,
            allow: baseValue.allow ?? false,
        })
    })
}

const submit = () => {
    permissionForm.put(`/dashboard/projects/${projectId}/role/${role.id}`, {
        onSuccess: () => {
            permissionForm.reset()
            initialValue()
        },
    })
}

watch(permissionForm, (value) => {
    const _baseFormValue = toRaw(baseFormValue.value)
    const _value = toRaw(value.permissions)

    isFormChanged.value = JSON.stringify(_baseFormValue) != JSON.stringify(_value)
})

initialValue()
</script>
