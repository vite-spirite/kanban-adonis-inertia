<template>
    <TransitionRoot appear :show="show" as="template">
        <Dialog as="div" @close="emits('close')" class="relative z-10">
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
                                Create category
                            </DialogTitle>
                            <div class="mt-2">
                                <form
                                    class="w-full flex flex-col justify-start items-start space-y-4"
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
                                            v-model="form.name"
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
                                            v-model="form.color"
                                            type="color"
                                            id="categoryColor"
                                            class="border-none rounded-lg focus:outline-none focus:border-blue-500 transition"
                                        />
                                    </div>
                                </form>
                            </div>

                            <div class="mt-4 flex flex-row justify-start items-center space-x-4">
                                <button
                                    type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                    @click="submit"
                                >
                                    Create
                                </button>

                                <button
                                    type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-400 cursor-pointer"
                                    @click="emits('close')"
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

<script lang="ts" setup>
import { Dialog, TransitionRoot, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/vue'
import { useForm } from '@inertiajs/vue3'

const { show, initialOrder, projectId } = defineProps<{
    show: boolean
    initialOrder: number
    projectId: number
}>()
const emits = defineEmits<{
    (e: 'close'): void
}>()

const form = useForm<{
    name: string
    color: string
    order: number
}>({
    name: '',
    color: '#000000',
    order: initialOrder,
})

const submit = () => {
    form.post(`/dashboard/projects/${projectId}/categories`, {
        onSuccess: () => {
            form.reset()
            emits('close')
        },
    })
}
</script>
