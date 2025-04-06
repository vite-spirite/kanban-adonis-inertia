<template>
    <div
        class="flex flex-row justify-start items-stretch space-x-4 w-full min-w-screen overflow-x-auto h-full px-4"
    >
        <div class="min-w-md max-w-md w-full"></div>

        <draggable
            v-model="categories"
            item-key="id"
            group="categories"
            class="flex flex-row justify-start items-stretch space-x-4 flex-1 h-full"
            @change="onChange"
            :disabled="!allowSorting || isSaved"
        >
            <template #item="{ element: category }">
                <div
                    class="min-w-md max-w-md w-full flex flex-col justify-start items-start rounded-lg border border-gray-200 bg-gray-100 transition"
                >
                    <div class="flex flex-row justify-start items-center p-4 w-full">
                        <div class="bg-green-500 rounded-full size-4 mr-2"></div>
                        <h2 class="text-xl font-semibold text-gray-800 flex-1">
                            {{ category.name }}
                        </h2>
                    </div>
                </div>
            </template>
        </draggable>

        <div class="min-w-md max-w-md w-full flex flex-col justify-start items-start">
            <div
                class="flex flex-row justify-start items-center py-4 border-b-2 border-gray-200 w-full"
            >
                <h2 class="text-2xl font-semibold text-gray-800">+ Create category</h2>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { CategoryDto } from '#types/category.dto'
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { useForm } from '@inertiajs/vue3'
import { useDebounceFn } from '@vueuse/core'

const { projectId } = defineProps<{ projectId: number; allowSorting: boolean }>()
const categories = defineModel<CategoryDto[]>({ required: true })
const categoryChangedIds = ref<number[]>([])
const isSaved = ref(false)

const form = useForm<{ categories: { id: number; order: number }[] }>({
    categories: [],
})

const initialOrderCategories = () => {
    categories.value.forEach((category, index) => {
        category.order = index
    })
}

initialOrderCategories()

const onChange = async (e: any) => {
    if (!e.moved) return

    categoryChangedIds.value.push(e.moved.element.id)
    await submitChangeDebounced()
}

const submitChangeDebounced = useDebounceFn(async () => {
    if (categoryChangedIds.value.length <= 0) return
    isSaved.value = true

    const payload: { id: number; order: number }[] = []

    categories.value.forEach((category, index) => {
        payload.push({
            id: category.id,
            order: index,
        })
    })

    form.categories = payload

    form.put(`/dashboard/projects/${projectId}/categories/order`, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
            categoryChangedIds.value = []
            initialOrderCategories()
            isSaved.value = false
        },
    })
}, 2000)
</script>
