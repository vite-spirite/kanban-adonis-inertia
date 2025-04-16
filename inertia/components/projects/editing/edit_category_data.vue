<template>
    <Menu as="div" class="relative inline-block text-left z-20">
        <TransitionRoot v-if="allowEdit" appear :show="openEditModal" as="template">
            <Dialog as="div" @close="openEditModal = false" class="relative">
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
                                    Edit "{{ category.name }}"
                                </DialogTitle>
                                <div class="mt-4 w-full">
                                    <form
                                        class="w-full flex flex-col justify-start items-start space-y-4"
                                        @submit.prevent="editSubmit"
                                    >
                                        <div
                                            class="flex flex-col justify-start items-start space-y-2 w-full"
                                        >
                                            <label
                                                for="categoryName"
                                                class="font-medium text-gray-900 text-sm"
                                                >Category name:</label
                                            >
                                            <input
                                                v-model="editForm.name"
                                                type="text"
                                                id="categoryName"
                                                class="w-full border-2 border-gray-200 rounded-lg p-2 focus:outline-none focus:border-blue-500 transition"
                                            />
                                        </div>

                                        <div
                                            class="flex flex-row justify-start items-center space-x-2 w-full"
                                        >
                                            <label
                                                for="categoryColor"
                                                class="font-medium text-gray-900 text-sm"
                                                >Category color:</label
                                            >
                                            <input
                                                v-model="editForm.color"
                                                type="color"
                                                id="categoryColor"
                                                class="border-none rounded-lg focus:outline-none focus:border-blue-500 transition"
                                            />
                                        </div>
                                    </form>
                                </div>

                                <div class="mt-4">
                                    <button
                                        type="button"
                                        class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                        @click="editSubmit"
                                    >
                                        Save
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>

        <TransitionRoot v-if="allowDelete" appear :show="openDeleteModal" as="template">
            <Dialog as="div" @close="openDeleteModal = false" class="relative z-50">
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
                                    Delete "{{ category.name }}"
                                </DialogTitle>
                                <div class="mt-4 w-full">
                                    <p>
                                        Are you sure you want to delete this category? This action
                                        cannot be undone.
                                    </p>
                                </div>

                                <div
                                    class="mt-4 flex flex-row justify-items-start items-center space-x-2"
                                >
                                    <button
                                        type="button"
                                        class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                        @click="deleteSubmit"
                                    >
                                        Delete
                                    </button>

                                    <button
                                        type="button"
                                        class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-500 focus:outline-none hover:text-gray-400 transition"
                                        @click="openDeleteModal = false"
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

        <div>
            <MenuButton
                class="inline-flex w-full px-2 py-2 text-sm font-medium text-gray-900 bg-transparent hover:bg-black/10 rounded-lg transition"
            >
                <EllipsisHorizontalIcon class="h-5 w-5" />
            </MenuButton>
        </div>

        <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
        >
            <MenuItems
                class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
            >
                <div class="px-1 py-1">
                    <MenuItem v-if="allowEdit" v-slot="{ active }">
                        <button
                            :class="[
                                active ? `bg-blue-500 text-white` : 'text-gray-900',
                                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                            ]"
                            @click="openEditModal = true"
                        >
                            <PencilIcon
                                :active="active"
                                class="mr-2 h-5 w-5 text-blue-300"
                                aria-hidden="true"
                            />
                            Edit
                        </button>
                    </MenuItem>

                    <MenuItem v-if="allowDelete" v-slot="{ active }">
                        <button
                            :class="[
                                active ? 'bg-blue-500 text-white' : 'text-gray-900',
                                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                            ]"
                            @click="openDeleteModal = true"
                        >
                            <TrashIcon
                                :active="active"
                                class="mr-2 h-5 w-5 text-blue-300"
                                aria-hidden="true"
                            />
                            Delete
                        </button>
                    </MenuItem>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>

<script setup lang="ts">
import type { CategoryDto } from '#types/category.dto'

import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogTitle,
    DialogPanel,
} from '@headlessui/vue'
import { TrashIcon, EllipsisHorizontalIcon, PencilIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'

const { category } = defineProps<{
    category: CategoryDto
    allowEdit: boolean
    allowDelete: boolean
}>()

const openEditModal = ref(false)
const openDeleteModal = ref(false)

const editForm = useForm<{ name: string; color: string }>({
    name: category.name,
    color: category.color,
})

const editSubmit = () => {
    editForm.put(`/dashboard/projects/${category.projectId}/categories/${category.id}`, {
        preserveScroll: true,
        onSuccess: () => {
            openEditModal.value = false
        },
    })
}

const deleteForm = useForm({})

const deleteSubmit = () => {
    deleteForm.delete(`/dashboard/projects/${category.projectId}/categories/${category.id}`, {
        preserveScroll: true,
        onSuccess: () => {
            openDeleteModal.value = false
        },
    })
}
</script>
