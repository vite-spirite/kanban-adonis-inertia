<template>
    <div
        class="w-full rounded-lg border-1 border-gray-200 p-4 shadow-none hover:shadow-md transition"
    >
        <vuedraggable
            class="flex flex-row justify-start items-start gap-2 w-full flex-wrap min-h-[5px]"
            group="task_tag"
            v-model="tags"
            item-key="id"
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

        <div v-if="task.dueDate" class="flex flex-row justify-start items-start space-x-2 mt-4">
            <ClockIcon class="w-5 h-5 text-gray-500" />
            <span class="text-sm font-medium text-gray-600">{{ formatDate }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { TaskDto } from '#types/task.dto'
import { DateTime } from 'luxon'
import { computed, ref } from 'vue'
import { ClockIcon } from '@heroicons/vue/24/outline'

import Tag from '~/components/projects/tag.vue'
import vuedraggable from 'vuedraggable'

const { task } = defineProps<{ task: TaskDto }>()

const tags = ref<TaskDto[]>([])

const formatDate = computed(() => {
    if (!task.dueDate) return 'No due date'

    const date = DateTime.fromISO(task.dueDate)
    return date.isValid ? date.toFormat('dd LLL yyyy') : 'No due date'
})
</script>
