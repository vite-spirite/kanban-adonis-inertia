<template>
    <div
        class="flex flex-col justify-start items-start space-y-4 border border-gray-200 rounded-lg p-4"
    >
        <h1 class="text-2xl font-bold text-xl font-open-sans">{{ user.fullName }}</h1>

        <div class="flex flex-col justify-start items-start w-full divide-y divide-gray-200">
            <div
                class="flex flex-row justify-between items-center w-full py-2"
                v-for="role in form.roles"
                :key="`user_${user.id}_role_${role.id}`"
            >
                <h3 class="font-semibold text-md">
                    {{ findRoleById(role.id)?.name }}
                </h3>

                <Switch v-model="role.allow" as="template" v-slot="{ checked }">
                    <button
                        class="relative inline-flex h-6 w-11 items-center rounded-full"
                        :class="checked ? 'bg-blue-600' : 'bg-gray-200'"
                    >
                        <span class="sr-only">Enable notifications</span>
                        <span
                            :class="checked ? 'translate-x-6' : 'translate-x-1'"
                            class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                        >
                        </span>
                    </button>
                </Switch>
            </div>
        </div>

        <button
            :disabled="editedValue == false"
            @click="submit"
            class="w-full inline-block bg-blue-500 text-white rounded-lg p-2 text-center hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-75"
        >
            Save changes
        </button>
    </div>
</template>

<script lang="ts" setup>
import type { RoleDto } from '#types/role.dto'
import type { UserDto } from '#types/user.dto'
import type { ProjectDto } from '#types/project.dto'

import { Switch } from '@headlessui/vue'
import { useForm } from '@inertiajs/vue3'
import { ref, toRaw, watch } from 'vue'

const { user, roles, project } = defineProps<{
    roles: RoleDto[]
    user: UserDto
    project: ProjectDto
}>()

const form = useForm<{ user_id: number; roles: { id: number; allow: boolean }[] }>({
    user_id: user.id,
    roles: [],
})

const initialValue = ref<{ id: number; allow: boolean }[]>([])
const editedValue = ref<boolean>(false)

const findRoleById = (id: number) => {
    return roles.find((r) => r.id === id)
}

const hasRole = (role: RoleDto) => {
    if (!role.users) {
        return false
    }

    return !!role.users.find((u) => u.id === user.id)
}

const checkIfEditedValue = () => {
    const initial = toRaw(initialValue.value)
    const current = toRaw(form.roles)

    editedValue.value = JSON.stringify(current) != JSON.stringify(initial)
}

const initializeValue = () => {
    form.roles = []
    initialValue.value = []

    roles.forEach((role) => {
        form.roles.push({
            id: role.id,
            allow: hasRole(role),
        })

        initialValue.value.push({
            id: role.id,
            allow: hasRole(role),
        })
    })
}

watch(form, () => {
    checkIfEditedValue()
})

const submit = () => {
    form.put(`/dashboard/projects/${project.id}/members`, {
        preserveState: true,
    })
}

watch(
    () => roles,
    () => {
        initializeValue()
    }
)

initializeValue()
</script>
