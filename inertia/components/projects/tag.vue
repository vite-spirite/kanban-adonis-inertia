<template>
    <div class="rounded-md relative overflow-hidden">
        <div
            class="absolute opacity-20 top-0 left-0 w-full h-full"
            :style="{ 'background-color': tag.color }"
        ></div>

        <span
            class="relative z-10 font-medium text-sm px-2 py-1 inline-block"
            :style="{ color: tag.color }"
            >{{ tag.name }}</span
        >
    </div>
</template>

<script lang="ts" setup>
import type { TagDto } from '#types/tag.dto'

const { tag } = defineProps<{ tag: TagDto }>()
</script>
