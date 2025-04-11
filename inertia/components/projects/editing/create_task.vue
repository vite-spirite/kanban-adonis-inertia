<template>
    <TransitionRoot appear :show="open" as="template">
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
                                Create new task
                            </DialogTitle>
                            <div class="mt-2 w-full">
                                <form
                                    class="w-full flex flex-col justify-start items-start space-y-2 w-full"
                                    @submit.prevent="submit"
                                >
                                    <div
                                        class="flex flex-col justify-start items-start space-y-2 w-full"
                                    >
                                        <label
                                            for="taskName"
                                            class="text-sm font-medium text-gray-900"
                                            >Name:</label
                                        >
                                        <input
                                            id="taskName"
                                            v-model="form.name"
                                            class="w-full bg-none border borer-gray-200 rounded-lg p-2"
                                        />
                                    </div>

                                    <div
                                        class="flex flex-col justify-start items-start space-y-2 w-full"
                                    >
                                        <label
                                            for="taskDesc"
                                            class="text-sm font-medium text-gray-900"
                                            >Description:</label
                                        >
                                        <textarea
                                            id="taskDesc"
                                            v-model="form.description"
                                            class="w-full bg-none border borer-gray-200 rounded-lg p-2"
                                        ></textarea>
                                    </div>

                                    <div
                                        class="flex flex-col justify-start items-start space-y-2 w-full"
                                    >
                                        <label
                                            for="taskDate"
                                            class="text-sm font-medium text-gray-900"
                                            >Date:</label
                                        >
                                        <input
                                            id="taskDate"
                                            type="datetime-local"
                                            v-model="form.dueDate"
                                            class="w-full bg-none border borer-gray-200 rounded-lg p-2"
                                        />
                                    </div>
                                </form>
                            </div>

                            <div class="mt-4 flex flex-row justify-start items-center space-x-2">
                                <button
                                    type="button"
                                    class="cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                    @click="submit"
                                >
                                    Create
                                </button>

                                <button
                                    type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent text-gray-400 hover:text-gray-600 cursor-pointer"
                                    @click="emit('close')"
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
</template>

<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { Dialog, TransitionRoot, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/vue'
import { watch } from 'vue'

const { open, categoryId, order, projectId } = defineProps<{
    open: boolean
    categoryId: number
    order: number
    projectId: number
}>()
const emit = defineEmits<{
    (e: 'close'): void
}>()

const form = useForm<{
    categoryId: number
    order: number
    name: string
    description: string
    dueDate: string
}>({
    categoryId: categoryId,
    order: order,
    name: '',
    description: '',
    dueDate: '',
})

watch(
    () => order,
    () => (form.order = order)
)
watch(
    () => categoryId,
    () => (form.categoryId = categoryId)
)

const submit = () => {
    form.post(`/dashboard/projects/${projectId}/tasks`, {
        onSuccess: () => {
            emit('close')
        },
    })
}
</script>
