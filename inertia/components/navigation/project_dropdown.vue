<template>
    <Popover v-slot="{ open }" class="relative">
        <!-- Use the `open` state to conditionally change the direction of the chevron icon. -->
        <PopoverButton
            class="flex flex-row justify-start items-center space-x-2 h-full cursor-pointer"
        >
            <span class="font-semibold text-md font-roboto text-gray-900">Projects</span>
            <ChevronDownIcon class="size-4 transition" :class="{ 'rotate-180 transform': open }" />
        </PopoverButton>
        <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-1 opacity-0"
        >
            <PopoverPanel
                class="absolute mt-5 left-1/2 -translate-x-1/2 origin-top-right w-xl max-w-xl overflow-hidden border-gray-200 border rounded-lg shadow-lg bg-white flex flex-col justify-start items-start z-50"
            >
                <div class="grid grid-cols-3 gap-2 p-2">
                    <Link
                        :href="`/dashboard/projects/${project.id}`"
                        class="flex flex-row justify-start items-center px-4 py-2 space-x-2 hover:bg-black/15 rounded-lg transition"
                        v-for="project in projects"
                        :key="`minimal-projects-${project.id}`"
                    >
                        <img v-if="project.image" :src="project.image" class="rounded-lg size-8" />
                        <img
                            v-else
                            :src="`https://ui-avatars.com/api/?name=${encodeURI(project.name)}&background=000&color=fff&size=64`"
                            class="rounded-lg size-8"
                        />
                        <span>{{ project.name }}</span>
                    </Link>
                </div>
                <div class="px-2 pb-2 w-full">
                    <Link
                        href="/dashboard/projects/create"
                        class="flex flex-row justify-center items-center px-4 py-2 space-x-2 rounded-lg transition border-2 border-dashed border-black/15 hover:bg-blue-500 hover:text-gray-100 hover:border-transparent"
                    >
                        <PlusCircleIcon class="size-6" />
                        <span class="text-md font-medium font-open-sans">Create</span>
                    </Link>
                </div>
            </PopoverPanel>
        </transition>
    </Popover>
</template>

<script lang="ts" setup>
import type { MinimalProjectDto } from '#types/project.dto'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { PlusCircleIcon } from '@heroicons/vue/24/outline'
import { Link } from '@inertiajs/vue3'

const { projects } = defineProps<{ projects: MinimalProjectDto[] }>()
</script>
