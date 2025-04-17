<template>
    <div class="w-full flex flex-row justify-start items-center space-x-4">
        <input
            type="checkbox"
            class="size-4"
            :checked="line.completedAt !== null"
            :disabled="!allowCheck"
            @change="toggleRow"
        />

        <input
            type="text"
            class="outline-transparent focus:outline-1 focus:outline-blue-500 font-medium text-md flex-1 py-1 px-2 rounded-lg"
            v-model="form.name"
            @change="updateLineDebounced"
            :disabled="!allowEditable"
        />

        <button
            class="text-gray-400 hover:text-red-500 transition duration-75 cursor-pointer transition disabled:hover:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            @click="deleteRow"
            :disabled="!allowDeletable"
        >
            <TrashIcon class="size-4" />
        </button>
    </div>
</template>
<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline'
import type { ListLineDto } from '#types/list_line.dto'
import { router, useForm } from '@inertiajs/vue3'
import { useDebounceFn } from '@vueuse/core'
import { watch } from 'vue'

const { line, projectId, taskId, listId } = defineProps<{
    line: ListLineDto
    projectId: number
    taskId: number
    listId: number
    allowEditable: boolean
    allowDeletable: boolean
    allowCheck: boolean
}>()

watch(
    () => line,
    () => {
        form.name = line.name
    }
)

const form = useForm<{ name: string }>({
    name: line.name,
})

const updateLineDebounced = useDebounceFn(() => {
    form.put(`/dashboard/projects/${projectId}/tasks/${taskId}/lists/${listId}/rows/${line.id}`, {
        preserveState: true,
    })
}, 500)

const toggleRow = () => {
    router.post(
        `/dashboard/projects/${projectId}/tasks/${taskId}/lists/${listId}/rows/${line.id}/check`
    )
}

const deleteRow = () => {
    router.delete(
        `/dashboard/projects/${projectId}/tasks/${taskId}/lists/${listId}/rows/${line.id}`
    )
}
</script>
