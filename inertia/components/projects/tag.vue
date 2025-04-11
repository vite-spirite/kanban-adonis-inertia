<template>
    <TransitionRoot v-if="removable" appear :show="deleteDialogOpen" as="template">
        <Dialog as="div" @close="deleteDialogOpen = false" class="relative z-10">
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
                                Delete tag "{{ tag.name }}"
                            </DialogTitle>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">
                                    Are you sure you want to delete this tag? This action cannot be
                                    undone.
                                </p>
                            </div>

                            <div class="mt-4 flex flex-row justify-start items-center space-x-4">
                                <button
                                    type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                    @click="deleteTag"
                                >
                                    Delete
                                </button>

                                <button
                                    type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-400 cursor-pointer"
                                    @click="deleteDialogOpen = false"
                                >
                                    Cancel
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <TransitionRoot v-if="editable" appear :show="editDialogOpen" as="template">
        <Dialog as="div" @close="editDialogOpen = false" class="relative z-10">
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
                                Edit "{{ tag.name }}"
                            </DialogTitle>
                            <div class="mt-2 w-full">
                                <form
                                    class="flex flex-col justify-start items-start space-y-4 w-full"
                                    @submit.prevent="editTag"
                                >
                                    <div
                                        class="flex flex-col justify-start items-start space-y-2 w-full"
                                    >
                                        <label for="tagName" class="text-sm font-medium"
                                            >Tag name</label
                                        >
                                        <input
                                            v-model="editForm.name"
                                            type="text"
                                            id="tagName"
                                            class="w-full border-2 border-gray-200 rounded-lg p-2 focus:outline-none focus:border-blue-500 transition"
                                        />
                                    </div>

                                    <div
                                        class="flex flex-row justify-start items-center space-x-2 w-full"
                                    >
                                        <label for="tagColor" class="text-sm font-medium"
                                            >Tag color</label
                                        >
                                        <input
                                            v-model="editForm.color"
                                            type="color"
                                            id="tagColor"
                                        />
                                    </div>
                                </form>
                            </div>

                            <div class="mt-4 flex flex-row justify-start items-center space-x-4">
                                <button
                                    type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                    @click="editTag"
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-400 cursor-pointer"
                                    @click="editDialogOpen = false"
                                >
                                    Cancel
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <div class="rounded-md relative overflow-hidden flex flex-row justify-start items-stretch">
        <div
            class="absolute opacity-20 top-0 left-0 w-full h-full transition-all duration-300"
            :style="{ 'background-color': tag.color }"
        ></div>

        <span
            class="relative z-10 font-medium text-sm flex items-center px-2 py-1"
            :style="{ color: tag.color }"
            >{{ tag.name }}</span
        >

        <button
            v-if="editable"
            class="bg-transparent hover:bg-gray-50/25 relative z-10 px-1.5 py-1 flex flex-row items-center !text-gray-950 cursor-pointer"
            :style="{ color: tag.color }"
            @click="editDialogOpen = true"
        >
            <PencilIcon class="size-3" />
        </button>

        <button
            v-if="removable"
            class="bg-transparent hover:bg-gray-50/25 relative z-10 px-1.5 py-1 flex flex-row items-center !text-gray-950 cursor-pointer"
            :style="{ color: tag.color }"
            @click="deleteDialogOpen = true"
        >
            <TrashIcon class="size-3" />
        </button>
    </div>
</template>

<script lang="ts" setup>
import type { TagDto } from '#types/tag.dto'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { Dialog, DialogTitle, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useForm } from '@inertiajs/vue3'

const { tag } = defineProps<{ tag: TagDto; editable: boolean; removable: boolean }>()

const deleteDialogOpen = ref(false)
const deleteForm = useForm({})

const editDialogOpen = ref(false)
const editForm = useForm<{ id: number; name: string; color: string }>({
    id: tag.id,
    name: tag.name,
    color: tag.color,
})

const deleteTag = () => {
    deleteForm.delete(`/dashboard/projects/${tag.projectId}/tags/${tag.id}`, {
        onSuccess: () => {
            deleteDialogOpen.value = false
        },
    })
}

const editTag = () => {
    editForm.put(`/dashboard/projects/${tag.projectId}/tags`, {
        onSuccess: () => {
            editDialogOpen.value = false
        },
    })
}
</script>
