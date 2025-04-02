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
                                Confirm deletion
                            </DialogTitle>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">
                                    Are you sure you want to delete this role? All associated data
                                    will be permanently removed. This action cannot be undone.
                                </p>
                            </div>

                            <div
                                class="mt-4 w-full flex flex-row justify-end items-center space-x-4"
                            >
                                <button
                                    type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    @click="emit('close')"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                    @click="confirm"
                                >
                                    Delete
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const emit = defineEmits<{
    (e: 'close'): void
}>()
const { isOpen, projectId, roleId } = defineProps<{
    isOpen: boolean
    roleId: number
    projectId: number
}>()

const deleteForm = useForm({})

const confirm = () => {
    deleteForm.delete(`/dashboard/projects/${projectId}/roles/${roleId}`)
}
</script>
