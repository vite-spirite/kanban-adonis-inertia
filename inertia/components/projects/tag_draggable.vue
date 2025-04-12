<template>
    <vuedraggable
        :list="tags"
        :group="{ name: 'task_tag', put: true, pull: 'clone' }"
        item-key="id"
        class="flex flex-row justify-start items-center gap-2 flex-wrap"
        @change="removeAddedTagByDraggable"
        :disabled="!allowDraggable"
    >
        <template #item="{ element: tag }">
            <div class="cursor-default">
                <ProjectTag :tag="tag" :editable="allowEditable" :removable="allowDeletable" />
            </div>
        </template>
    </vuedraggable>
</template>
<script setup lang="ts">
import type { TagDto } from '#types/tag.dto'
import vuedraggable from 'vuedraggable'
import ProjectTag from '~/components/projects/tag.vue'

const { tags } = defineProps<{
    tags: TagDto[]
    allowEditable: boolean
    allowDeletable: boolean
    allowDraggable: boolean
}>()

const removeAddedTagByDraggable = (e: any) => {
    if (e.added) {
        tags.splice(e.added.newIndex, 1)
    }
}
</script>
