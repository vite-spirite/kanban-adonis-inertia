<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="emit('close')" class="relative z-10">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                        >
                            <DialogTitle
                                as="h3"
                                class="text-lg font-medium leading-6 text-gray-900"
                            >
                                Add member
                            </DialogTitle>
                            <div class="mt-6">
                                <form>
                                    <div class="flex flex-col justify-start items-start space-y-2">
                                        <label
                                            for="email"
                                            class="block text-sm font-medium text-gray-950"
                                            >Email:</label
                                        >

                                        <input
                                            v-model="form.email"
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            class="w-full px-4 py-2 rounded-md border border-gray-200 outline-none"
                                        />
                                    </div>

                                    <div
                                        class="gap-4 flex flex-row justify-start items-center flex-wrap"
                                    >
                                        <div
                                            v-for="role in form.roles"
                                            :key="`role_invite_member_${role.id}`"
                                            class="flex flex-row justify-start items-center space-x-2 mt-4"
                                        >
                                            <Switch
                                                v-model="role.allow"
                                                :class="role.allow ? 'bg-blue-600' : 'bg-gray-200'"
                                                class="relative inline-flex h-6 w-11 items-center rounded-full"
                                            >
                                                <span class="sr-only">Enable notifications</span>
                                                <span
                                                    :class="
                                                        role.allow
                                                            ? 'translate-x-6'
                                                            : 'translate-x-1'
                                                    "
                                                    class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                                                />
                                            </Switch>

                                            <span>{{ getRoleById(role.id)?.name }}</span>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div class="mt-4">
                                <button
                                    type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    @click="send"
                                >
                                    Send invite
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script lang="ts" setup>
import type { RoleDto } from '#types/role.dto'
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Switch,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import { useForm } from '@inertiajs/vue3'

const emit = defineEmits<{
    (e: 'close'): void
}>()

const { isOpen, roles, projectId } = defineProps<{
    isOpen: boolean
    roles: RoleDto[]
    projectId: number
}>()

const form = useForm<{
    email: string
    roles: { id: number; allow: boolean }[]
}>({
    email: '',
    roles: [],
})

roles.forEach((role) => {
    form.roles.push({ id: role.id, allow: false })
})

const getRoleById = (id: number) => {
    return roles.find((role) => {
        return role.id == id
    })
}

const send = () => {
    form.post(`/dashboard/projects/${projectId}/member`, {
        onSuccess: () => {
            emit('close')
        },
    })
}
</script>
