<template>
    <div class="flex flex-col justify-items-start items-start w-full text-gray-600 space-y-4">
        <div class="flex flex-row justify-start items-center space-x-4 w-full">
            <ListBulletIcon class="size-4" />

            <input
                class="outline-transparent focus:outline-1 focus:outline-blue-500 font-semibold text-lg flex-1 py-1 px-2 rounded-lg"
                v-model="updateListForm.name"
                @change="updateListDebounced"
                :disabled="!allowEditable"
            />
            <button
                class="text-gray-400 hover:text-red-500 transition duration-75 cursor-pointer transition disabled:hover:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                @click="deleteList"
                :disabled="!allowDeletable"
            >
                <TrashIcon class="size-4" />
            </button>
        </div>

        <div v-for="line in list.lines" class="w-full pl-10">
            <ProjectTaskLine
                :line="line"
                :projectId="projectId"
                :taskId="taskId"
                :listId="list.id"
                :allowEditable="allowEditable"
                :allowDeletable="allowDeletable"
                :allowCheck="allowCheck"
            />
        </div>
        <form
            class="flex flex-row justify-start items-center space-x-4 w-full pl-10"
            @submit.prevent="submitNewLine"
            v-if="allowEditable"
        >
            <input
                type="text"
                class="outline-transparent focus:outline-1 focus:outline-blue-500 font-medium text-lg flex-1 py-1 px-2 rounded-lg"
                placeholder="New line..."
                v-model="createNewLineForm.name"
            />
            <button
                class="bg-green-100 text-green-900 hover:bg-green-300 cursor-pointer transition duration-75 px-2 py-1 rounded-md text-sm font-medium"
            >
                <span class="inline-block" @click="submitNewLine">Add</span>
            </button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ListBulletIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type { ListDto } from '#types/list.dto'
import { router, useForm } from '@inertiajs/vue3'
import { useDebounceFn } from '@vueuse/core'
import { watch } from 'vue'

import ProjectTaskLine from '~/components/projects/list_row.vue'

const { list, projectId, taskId } = defineProps<{
    list: ListDto
    projectId: number
    taskId: number
    allowDeletable: boolean
    allowEditable: boolean
    allowCheck: boolean
}>()

watch(
    () => list,
    () => {
        updateListForm.name = list.name
        createNewLineForm.order = list.lines.length
    }
)

const updateListForm = useForm<{ name: string }>({
    name: list.name,
})

const deleteList = () => {
    router.delete(`/dashboard/projects/${projectId}/tasks/${taskId}/lists/${list.id}`, {
        preserveState: true,
        preserveScroll: true,
    })
}

const updateListDebounced = useDebounceFn(() => {
    updateListForm.put(`/dashboard/projects/${projectId}/tasks/${taskId}/lists/${list.id}`)
}, 500)

const createNewLineForm = useForm<{ name: string; order: number }>({
    name: '',
    order: list.lines.length,
})

const submitNewLine = () => {
    createNewLineForm.post(
        `/dashboard/projects/${projectId}/tasks/${taskId}/lists/${list.id}/rows`,
        {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                createNewLineForm.name = ''
                createNewLineForm.order = list.lines.length
            },
        }
    )
}
</script>
