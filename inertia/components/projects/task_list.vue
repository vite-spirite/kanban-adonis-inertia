<template>
    <div class="flex flex-col justify-items-start items-start w-full text-gray-600">
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
    </div>
</template>

<script lang="ts" setup>
import { ListBulletIcon, TrashIcon } from '@heroicons/vue/24/outline'
import type { ListDto } from '#types/list.dto'
import { router, useForm } from '@inertiajs/vue3'
import { useDebounceFn } from '@vueuse/core'
import { watch } from 'vue'

const { list, projectId, taskId } = defineProps<{
    list: ListDto
    projectId: number
    taskId: number
    allowDeletable: boolean
    allowEditable: boolean
}>()

watch(
    () => list,
    () => {
        updateListForm.name = list.name
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
</script>
