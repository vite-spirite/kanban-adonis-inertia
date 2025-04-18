<template>
    <div class="text-sm w-full text-gray-500">
        <p>
            {{ dateToString(activity.createdAt) }}

            <span class="font-medium text-gray-900">{{ activity.actor.fullName }} </span>

            <span v-if="activity.type == 'task_created'">
                create task "<strong class="text-gray-900">{{ activity.meta.name }}</strong
                >" in category "<strong class="text-gray-900">{{ activity.meta.category }}</strong
                >".</span
            >

            <span
                v-else-if="
                    activity.type == 'task_updated' &&
                    activity.meta.fromName !== activity.meta.toName
                "
            >
                change task name from: "<strong class="text-gray-900">{{
                    activity.meta.fromName
                }}</strong
                >" to: "<strong class="text-gray-900">{{ activity.meta.toName }}</strong
                >".
            </span>
            <span
                v-else-if="
                    activity.type == 'task_updated' &&
                    activity.meta.fromDescription !== activity.meta.toDescription
                "
            >
                change task description from: "<strong class="text-gray-900">{{
                    activity.meta.fromDescription
                }}</strong
                >" to: "<strong class="text-gray-900">{{ activity.meta.toDescription }}</strong
                >".
            </span>
            <span
                v-else-if="
                    activity.type == 'task_updated' &&
                    activity.meta.fromDueDate !== activity.meta.toDueDate
                "
            >
                change task deadline from: "<strong class="text-gray-900">{{
                    dateToString(activity.meta.fromDueDate)
                }}</strong
                >" to: "<strong class="text-gray-900">{{
                    dateToString(activity.meta.toDueDate)
                }}</strong
                >".
            </span>

            <span v-else-if="activity.type == 'task_moved'">
                task moved from: "<strong class="text-gray-900">{{ activity.meta.from }}</strong>
                to: "<strong class="text-gray-900">{{ activity.meta.to }}</strong
                >".
            </span>

            <span v-else-if="activity.type == 'task_deleted'">
                task "<strong class="text-gray-900">{{ activity.meta.name }}</strong
                >" deleted.
            </span>

            <span v-else-if="activity.type == 'task_tag_removed'">
                remove tag "<strong :style="{ color: activity.meta.color }">{{
                    activity.meta.name
                }}</strong
                >".
            </span>

            <span v-else-if="activity.type == 'task_tag_added'">
                add tag "<strong :style="{ color: activity.meta.color }">{{
                    activity.meta.name
                }}</strong
                >".
            </span>

            <span v-else-if="activity.type == 'list_created'">
                create new task list "<strong class="text-gray-900">{{ activity.meta.name }}</strong
                >".
            </span>

            <span v-else-if="activity.type == 'list_deleted'">
                remove task list "<strong class="text-gray-900">{{ activity.meta.name }}</strong
                >".
            </span>

            <span v-else-if="activity.type == 'list_updated'">
                change task list name from "<strong class="text-gray-900">{{
                    activity.meta.fromName
                }}</strong
                >" to "<strong class="text-gray-900">{{ activity.meta.toName }}</strong
                >".
            </span>

            <span v-else-if="activity.type == 'list_line_created'">
                create new task list line "<strong class="text-gray-900">{{
                    activity.meta.name
                }}</strong
                >" in list "<strong class="text-gray-900">{{ activity.meta.listName }}</strong
                >".
            </span>

            <span v-else-if="activity.type == 'list_line_deleted'">
                remove task list line "<strong class="text-gray-900">{{
                    activity.meta.name
                }}</strong
                >" in list "<strong class="text-gray-900">{{ activity.meta.listName }}</strong
                >".
            </span>

            <span v-else-if="activity.type == 'list_line_updated'">
                change task list line name from "<strong class="text-gray-900">{{
                    activity.meta.fromName
                }}</strong
                >" to "<strong class="text-gray-900">{{ activity.meta.toName }}</strong
                >" in list "<strong class="text-gray-900">{{ activity.meta.listName }}</strong
                >".
            </span>

            <span v-else-if="activity.type == 'list_line_uncompleted'">
                uncompleted task list line "<strong class="text-gray-900">{{
                    activity.meta.name
                }}</strong
                >" in list "<strong class="text-gray-900">{{ activity.meta.listName }}</strong
                >".
            </span>

            <span v-else-if="activity.type == 'list_line_completed'">
                completed task list line "<strong class="text-gray-900">{{
                    activity.meta.name
                }}</strong
                >" in list "<strong class="text-gray-900">{{ activity.meta.listName }}</strong
                >".
            </span>

            <span v-else-if="activity.type == 'attachment_created'">
                create new attachment "<strong class="text-gray-900">{{
                    activity.meta.name
                }}</strong
                >".
            </span>

            <span v-else-if="activity.type == 'attachment_deleted'">
                remove attachment "<strong class="text-gray-900">{{ activity.meta.name }}</strong
                >".
            </span>
        </p>
    </div>
</template>

<script lang="ts" setup>
import type { ActivityDto } from '#types/activity.dto'
import { DateTime } from 'luxon'

const { activity } = defineProps<{ activity: ActivityDto }>()

const dateToString = (date: string) => {
    return DateTime.fromISO(date).toFormat('dd LLL yyyy')
}
</script>
