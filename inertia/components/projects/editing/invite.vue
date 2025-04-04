<template>
    <div
        class="w-full flex flex-col justify-start items-start p-4 space-y-4 rounded-lg border border-gray-200"
    >
        <h1 class="font-bold text-xl font-open-sans">
            {{ invite.user?.fullName ?? invite.email }}
        </h1>

        <div class="flex flex-col justify-start items-start w-full divide-y divide-gray-200">
            <div
                v-for="role in invite.roles"
                :key="`invite_${invite.id}_role_${role.id}`"
                class="flex flex-row justify-between items-center w-full py-2"
            >
                <h3 class="font-semibold text-md">
                    {{ findRoleById(role.id)?.name }}
                </h3>

                <Switch
                    v-model="role.allow"
                    as="template"
                    v-slot="{ checked }"
                    disabled
                    class="disabled:cursor-not-allowed"
                >
                    <button
                        class="relative inline-flex h-6 w-11 items-center rounded-full"
                        :class="checked ? 'bg-green-600' : 'bg-gray-200'"
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
            class="w-full bg-red-100 hover:bg-red-200 text-red-900 rounded-lg px-4 py-2 cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!allowRemove"
            @click.prevent="submit"
        >
            Remove
        </button>
    </div>
</template>

<script lang="ts" setup>
import type { InviteDto } from '#types/invite.dto'
import type { RoleDto } from '#types/role.dto'
import { Switch } from '@headlessui/vue'
import { useForm } from '@inertiajs/vue3'

const { invite, roles } = defineProps<{
    invite: InviteDto
    roles: RoleDto[]
    allowRemove: boolean
}>()

const findRoleById = (id: number) => {
    return roles.find((role) => role.id === id)
}

const form = useForm<{ id: number }>({
    id: invite.id,
})

const submit = () => {
    form.delete(`/dashboard/projects/${invite.projectId}/invites/${invite.id}`, {
        preserveState: true,
        preserveScroll: true,
    })
}
</script>
