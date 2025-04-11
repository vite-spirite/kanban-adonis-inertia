<template>
    <div class="flex flex-row justify-start items-stretch space-x-4 h-full overflow-auto">
        <draggable
            v-model="categories"
            item-key="id"
            group="categories"
            class="flex flex-row justify-start items-stretch flex-1 h-full"
            @change="onChange"
            :disabled="!allowSorting || isSaved"
        >
            <template #item="{ element: category }">
                <ProjectCategory
                    :category="category"
                    :project-id="projectId"
                    :allow-deleting-task="allowDeletingTask"
                    :allow-editing-task="allowEditingTask"
                    :allow-creating-task="allowCreatingTask"
                    :allow-task-sorting="allowTaskSorting"
                    :allow-editing="allowEditing"
                    :allow-deleting="allowDeleting"
                    @task-changed="onTaskChange"
                />
            </template>
        </draggable>
    </div>
</template>

<script lang="ts" setup>
import type { CategoryDto } from '#types/category.dto'
import type { TaskDto } from '#types/task.dto'

import { PlusCircleIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { useDebounceFn } from '@vueuse/core'

import ProjectCategoryEdit from '~/components/projects/editing/edit_category_data.vue'
import ProjectTaskCard from '~/components/projects/task.vue'
import ProjectCreateTask from '~/components/projects/editing/create_task.vue'
import ProjectCategory from '~/components/projects/category.vue'
import draggable from 'vuedraggable'
import { transmit } from '~/utils/transmit'

const { projectId, allowEditing, allowDeleting } = defineProps<{
    projectId: number
    allowSorting: boolean
    allowEditing: boolean
    allowDeleting: boolean
    allowTaskSorting: boolean
    allowCreatingTask: boolean
    allowEditingTask: boolean
    allowDeletingTask: boolean
}>()

const createTaskDialog = ref(false)
const createTaskCategory = ref(-1)
const createTaskOrder = ref(0)

const addTaskClick = (category: CategoryDto) => {
    createTaskCategory.value = category.id
    createTaskOrder.value = category.tasks.length
    createTaskDialog.value = true
}

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
}, 500)

const onTaskChange = async (_: CategoryDto, e: any) => {
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
}, 500)
</script>
