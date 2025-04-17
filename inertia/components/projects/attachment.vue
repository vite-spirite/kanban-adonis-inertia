<template>
    <div class="flex flex-row justify-start items-center p-2 bg-gray-100 rounded-lg space-x-4">
        <div class="p-2 bg-gray-200 rounded-xl">
            <PaperAirplaneIcon class="size-4 -rotate-45" />
        </div>

        <div class="flex flex-col justify-start items-start p-2 flex-1">
            <h4 class="font-medium text-sm">{{ attachment.name }}</h4>
            <span class="text-sm text-gray-500" v-if="attachment.uploader"
                >upload by {{ attachment.uploader.fullName }}</span
            >
        </div>

        <div class="flex flex-row justify-start items-center p-2 space-x-2">
            <a
                v-if="allowDownload"
                :href="attachment.url"
                class="text-gray-500 hover:text-gray-900 transition cursor-pointer"
            >
                <ArrowDownTrayIcon class="w-5 h-5" />
            </a>

            <Link
                method="delete"
                :href="`/dashboard/projects/${projectId}/tasks/${taskId}/attachments/${attachment.id}`"
                as="button"
                class="text-gray-500 hover:text-red-900 transition cursor-pointer"
            >
                <TrashIcon class="w-5 h-5" />
            </Link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { AttachmentDto } from '#types/attachment.dto'
import { Link } from '@inertiajs/vue3'
import { PaperAirplaneIcon, ArrowDownTrayIcon, TrashIcon } from '@heroicons/vue/24/outline'

const {} = defineProps<{
    attachment: AttachmentDto
    allowDownload: boolean
    allowDelete: boolean
    projectId: number
    taskId: number
}>()
</script>
