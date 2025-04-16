<template>
    <div
        class="w-full rounded-lg border-1 border-gray-200 p-4 shadow-none hover:shadow-md transition"
        @click="clickTask"
    >
        <vuedraggable
            class="flex flex-row justify-start items-start gap-2 w-full flex-wrap min-h-[5px]"
            group="task_tag"
            v-model="tags"
            item-key="id"
            @change="onTagChanged"
            :disabled="!editable"
        >
            <template #item="{ element: tag }">
                <div>
                    <Tag :tag="tag" :editable="false" :removable="false" />
                </div>
            </template>
        </vuedraggable>

        <div class="flex flex-col justify-start items-start space-y-2 w-full mt-4">
            <h2 class="text-xl font-semibold text-gray-800">
                {{ task.name }}
            </h2>
            <p class="text-sm text-gray-600">
                {{ task.description }}
            </p>
        </div>

        <div class="flex flex-row justify-start items-center space-x-4 w-full mt-4">
            <div
                v-if="task.dueDate"
                class="flex flex-row justify-start items-start space-x-2 px-2 py-1"
            >
                <ClockIcon class="w-5 h-5 text-gray-500" />
                <span class="text-sm font-medium text-gray-600">{{ formatDate }}</span>
            </div>

            <div
                v-if="task.totalLines && task.totalCompletedLines && task.totalLines > 0"
                class="flex flex-row justify-start items-start space-x-2 text-gray-500 px-2 py-1"
                :class="{
                    '!text-green-900 bg-green-200 rounded-md':
                        task.totalLines == task.totalCompletedLines,
                }"
            >
                <DocumentCheckIcon class="w-5 h-5" />
                <span class="text-sm font-medium"
                    >{{ task.totalCompletedLines }}/{{ task.totalLines }}</span
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { TaskDto } from '#types/task.dto'
import type { TagDto } from '#types/tag.dto'

import { DateTime } from 'luxon'
import { computed, ref, watch } from 'vue'
import { router, useForm } from '@inertiajs/vue3'
import { ClockIcon, DocumentCheckIcon } from '@heroicons/vue/24/outline'

import Tag from '~/components/projects/tag.vue'
import vuedraggable from 'vuedraggable'
import { useDebounceFn } from '@vueuse/core'

const { task, projectId } = defineProps<{ task: TaskDto; projectId: number; editable: boolean }>()
const tags = ref<TagDto[]>(task.tags ?? [])

watch(
    () => task.tags,
    (newTags) => {
        tags.value = newTags
    }
)

const formatDate = computed(() => {
    if (!task.dueDate) return 'No due date'

    const date = DateTime.fromISO(task.dueDate)
    return date.isValid ? date.toFormat('dd LLL yyyy') : 'No due date'
})

const tagChangedIds = ref<number[]>([])
const tagForm = useForm<{ tags: { id: number; order: number }[] }>({
    tags: [],
})

const onTagChanged = async (e: any) => {
    console.log(e)

    if (e.added) {
        const tag = e.added.element as TagDto
        const tagWithoutAdded = [...tags.value]
        tagWithoutAdded.splice(e.added.newIndex, 1)

        if (tagWithoutAdded.find((t) => t.id === tag.id)) {
            tags.value.splice(e.added.newIndex, 1)

            return
        }

        tagChangedIds.value.push(e.added.element.id)
    }

    if (e.removed) {
        tagChangedIds.value.push(e.removed.element.id)
    }

    if (e.moved) {
        tagChangedIds.value.push(e.moved.element.id)
    }

    await saveTagChangedDebounced()
}

const saveTagChangedDebounced = useDebounceFn(async () => {
    if (tagChangedIds.value.length === 0) return

    const data: { id: number; order: number }[] = []

    tags.value.forEach((tag, index) => {
        data.push({
            id: tag.id,
            order: index,
        })
    })

    tagForm.tags = data

    tagForm.post(`/dashboard/projects/${projectId}/tasks/${task.id}/tags`, {
        preserveState: true,
        onSuccess: () => {
            tagChangedIds.value = []
        },
    })
}, 1000)

const clickTask = () => {
    router.get(
        `/dashboard/projects/${projectId}/tasks/${task.id}`,
        {},
        {
            preserveState: true,
            preserveScroll: true,
        }
    )
}
</script>
