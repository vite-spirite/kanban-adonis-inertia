<template>
    <div class="flex flex-row justify-start items-stretch space-x-4 h-full overflow-auto">
        <!--        <div class="min-w-xs max-w-xs w-full"></div>-->

        <draggable
            v-model="categories"
            item-key="id"
            group="categories"
            class="flex flex-row justify-start items-stretch flex-1 h-full"
            @change="onChange"
            :disabled="!allowSorting || isSaved"
        >
            <template #item="{ element: category }">
                <div
                    class="min-w-md max-w-md w-full flex flex-col justify-start items-start hover:bg-gray-50 transition group"
                >
                    <div
                        class="flex flex-row justify-start items-center p-4 w-full border-b border-gray-200 group-hover:border-gray-900 transition"
                    >
                        <div
                            class="rounded-full size-4 mr-2"
                            :style="{ 'background-color': category.color }"
                        ></div>
                        <h2 class="text-xl font-semibold text-gray-800 flex-1">
                            {{ category.name }}
                        </h2>

                        <ProjectCategoryEdit
                            :category="category"
                            :allow-delete="allowDeleting"
                            :allow-edit="allowEditing"
                            v-if="allowDeleting || allowEditing"
                        />
                    </div>

                    <draggable
                        v-model="category.tasks"
                        item-key="id"
                        group="tasks"
                        @change="(e) => onTaskChange(category, e)"
                        class="flex flex-col justify-start items-start flex-1 h-full space-y-2 w-full p-2"
                        :disabled="isTaskChangeSaved || !allowTaskSorting"
                    >
                        <template #item="{ element: task }">
                            <div class="w-full rounded-lg border border-gray-200 bg-gray-100 p-4">
                                <h1>{{ task.name }}</h1>
                                <pre>{{ task }}</pre>
                            </div>
                        </template>
                    </draggable>
                </div>
            </template>
        </draggable>

        <!--        <div class="min-w-xs max-w-xs w-full"></div>-->
    </div>
</template>

<script lang="ts" setup>
import type { CategoryDto } from '#types/category.dto'
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { useForm } from '@inertiajs/vue3'
import { useDebounceFn } from '@vueuse/core'

import ProjectCategoryEdit from '~/components/projects/editing/edit_category_data.vue'

const { projectId, allowEditing, allowDeleting } = defineProps<{
    projectId: number
    allowSorting: boolean
    allowEditing: boolean
    allowDeleting: boolean
    allowTaskSorting: boolean
}>()

const categories = defineModel<CategoryDto[]>({ required: true })
const categoryChangedIds = ref<number[]>([])
const taskChangedIds = ref<number[]>([])

const isSaved = ref(false)
const isTaskChangeSaved = ref(false)

const form = useForm<{ categories: { id: number; order: number }[] }>({
    categories: [],
})

const taskForm = useForm<{
    tasks: {
        id: number
        order: number
        categoryId: number
    }[]
}>({
    tasks: [],
})

const initialOrderCategories = () => {
    categories.value.forEach((category, index) => {
        category.order = index

        initialOrderTasks(category)
    })
}

const initialOrderTasks = (category: CategoryDto) => {
    category.tasks.forEach((task, index) => {
        task.order = index
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

const onTaskChange = async (category: CategoryDto, e: any) => {
    if (!e.moved && !e.added && !e.removed) return

    if (e.moved) {
        taskChangedIds.value.push(e.moved.element.id)
    }

    if (e.added) {
        taskChangedIds.value.push(e.added.element.id)
    }

    await submitTasksChangeDebounced()
}

const submitTasksChangeDebounced = useDebounceFn(async () => {
    if (taskChangedIds.value.length <= 0) return

    isTaskChangeSaved.value = true
    const payload: { id: number; order: number; categoryId: number }[] = []

    categories.value.forEach((category) => {
        category.tasks.forEach((task, index) => {
            payload.push({
                id: task.id,
                order: index,
                categoryId: category.id,
            })
        })
    })

    taskForm.tasks = payload

    taskForm.post(`/dashboard/projects/${projectId}/tasks/order`, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
            taskChangedIds.value = []
            initialOrderCategories()
            isTaskChangeSaved.value = false
        },
    })
}, 2000)
</script>
