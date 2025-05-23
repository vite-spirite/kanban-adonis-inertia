<template>
    <div
        class="min-w-md max-w-md w-full flex flex-col justify-start items-start hover:bg-gray-50 transition group h-auto min-h-full"
    >
        <ProjectCreateTask
            :category-id="currentCategory.id"
            :order="currentCategory.tasks.length ?? 0"
            :open="createTaskDialog"
            :project-id="currentCategory.projectId"
            @close="createTaskDialog = false"
        />

        <div
            class="flex flex-row justify-start items-center p-4 w-full border-b border-gray-200 group-hover:border-gray-900 transition"
        >
            <div
                class="rounded-full size-4 mr-2"
                :style="{ 'background-color': currentCategory.color }"
            ></div>

            <h2 class="text-xl font-semibold text-gray-800 flex-1">
                {{ currentCategory.name }}
            </h2>

            <ProjectCategoryEdit
                :category="currentCategory"
                :allow-delete="allowDeleting"
                :allow-edit="allowEditing"
                v-if="allowDeleting || allowEditing"
            />
        </div>

        <draggable
            v-model="currentCategory.tasks"
            item-key="id"
            group="tasks"
            @change="onTaskChange"
            class="flex flex-col justify-start items-start flex-1 h-auto min-h-full space-y-2 w-full p-2"
            :disabled="!allowTaskSorting"
        >
            <template #item="{ element: task }">
                <div class="w-full">
                    <ProjectTaskCard
                        :task="task as TaskDto"
                        :project-id="currentCategory.projectId"
                        :editable="allowEditingTask"
                    />
                </div>
            </template>
            <template #footer>
                <button
                    @click.prevent="createTaskDialog = true"
                    v-if="allowCreatingTask"
                    class="w-full border-2 border-dashed border-gray-200 rounded-lg p-2 mt-2 text-center text-gray-500 hover:bg-gray-50 transition hover:border-gray-900 hover:text-gray-900 transition cursor-pointer flex flex-row justify-center items-center space-x-2"
                >
                    <PlusCircleIcon class="size-6" />
                    <span class="inline-block">Add Task</span>
                </button>
            </template>
        </draggable>
    </div>
</template>

<script setup lang="ts">
import type { CategoryDto } from '#types/category.dto'
import type { TaskDto } from '#types/task.dto'

import { onMounted, onUnmounted, ref, watch } from 'vue'

import { PlusCircleIcon } from '@heroicons/vue/24/outline'
import ProjectTaskCard from '~/components/projects/task.vue'
import ProjectCategoryEdit from '~/components/projects/editing/edit_category_data.vue'
import ProjectCreateTask from '~/components/projects/editing/create_task.vue'

import draggable from 'vuedraggable'
import { type Subscription } from '@adonisjs/transmit-client'
import { transmit } from '~/utils/transmit'

const { category } = defineProps<{
    category: CategoryDto
    allowEditing: boolean
    allowDeleting: boolean
    allowTaskSorting: boolean
    allowCreatingTask: boolean
    allowEditingTask: boolean
    allowDeletingTask: boolean
}>()

const currentCategory = ref<CategoryDto>(category)
watch(
    () => category,
    () => {
        currentCategory.value = category
    }
)

const emit = defineEmits<{
    (e: 'taskChanged', category: CategoryDto, event): void
}>()

const createTaskDialog = ref<boolean>(false)

const onTaskChange = async (e: any) => {
    emit('taskChanged', category, e)
}

let subscription: null | Subscription = null

onMounted(async () => {
    subscription = transmit.instance.subscription(
        `/projects/${currentCategory.value.projectId}/category/${currentCategory.value.id}/tasks`
    )
    await subscription.create()

    subscription.onMessage(
        (data: { type: 'task.updated' | 'task.deleted' | 'task.created'; task: TaskDto }) => {
            if (data.type === 'task.updated') {
                const taskIdx = currentCategory.value.tasks.findIndex(
                    (task) => task.id === data.task.id
                )
                if (taskIdx !== -1) {
                    currentCategory.value.tasks[taskIdx] = data.task
                }
            }

            if (data.type === 'task.deleted') {
                const taskIdx = currentCategory.value.tasks.findIndex(
                    (task) => task.id === data.task.id
                )
                if (taskIdx !== -1) {
                    currentCategory.value.tasks.splice(taskIdx, 1)
                }
            }

            if (data.type === 'task.created') {
                currentCategory.value.tasks.push(data.task)
                currentCategory.value.tasks.sort((a, b) => a.order - b.order)
            }
        }
    )
})

onUnmounted(async () => {
    if (subscription) {
        await subscription.delete()
    }
})
</script>
