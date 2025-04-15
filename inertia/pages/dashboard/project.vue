<template>
    <Head v-if="!pageProps.task" :title="pageProps.project.name" />

    <ProjectTaskDialog
        v-if="pageProps.task"
        @close="onTaskDetailClose"
        :task="pageProps.task as TaskDto"
        :tags="pageProps.project.tags || []"
        :allow-editable="can(pageProps.capabilities, Permissions.PROJECT_TASK_EDIT)"
        :allow-deletable="can(pageProps.capabilities, Permissions.PROJECT_TASK_DELETE)"
        :allow-list-create="can(pageProps.capabilities, Permissions.PROJECT_TASK_LIST_CREATE)"
        :allow-list-editable="can(pageProps.capabilities, Permissions.PROJECT_TASK_LIST_EDIT)"
        :allow-list-deletable="can(pageProps.capabilities, Permissions.PROJECT_TASK_LIST_DELETE)"
    />

    <div class="flex flex-col w-full max-w-screen h-auto min-h-full">
        <ProjectHeader :project="pageProps.project" :capabilities="pageProps.capabilities" />

        <ProjectTagCreateDialog
            v-if="can(pageProps.capabilities, Permissions.PROJECT_TAG_CREATE)"
            :project-id="pageProps.project.id"
            :show="tagCreateDialog"
            @close="tagCreateDialog = false"
        />

        <div
            class="flex-1 w-full relative h-auto min-h-full flex flex-row justify-start items-stretch max-w-screen"
        >
            <div class="w-1/8 p-4 h-auto min-h-full bg-gray-100">
                <div class="flex flex-col justify-items-start items-start space-y-4">
                    <h3 class="font-semibold text-lg text-gray-800">Tags:</h3>

                    <TagDraggable
                        :tags="tags"
                        :allow-editable="can(pageProps.capabilities, Permissions.PROJECT_TAG_EDIT)"
                        :allow-deletable="
                            can(pageProps.capabilities, Permissions.PROJECT_TAG_DELETE)
                        "
                        :allow-draggable="
                            can(pageProps.capabilities, Permissions.PROJECT_TASK_EDIT)
                        "
                    />

                    <button
                        v-if="can(pageProps.capabilities, Permissions.PROJECT_TAG_CREATE)"
                        class="font-medium text-sm px-2 py-1 inline-flex flex-row justify-center items-center space-x-1 rounded-md bg-transparent border-2 border-dashed border-gray-200 text-gray-950 hover:bg-blue-500 hover:text-gray-50 hover:border-transparent transition duration-75 cursor-pointer"
                        @click.prevent="tagCreateDialog = true"
                    >
                        <PlusIcon class="size-4" />
                        <span class="inline-block">Create tag</span>
                    </button>
                </div>

                <div class="flex flex-col justify-items-start items-start space-y-4 mt-6">
                    <h3 class="font-semibold text-lg text-gray-800">Members:</h3>

                    <div class="flex flex-col justify-start items-center space-y-4 w-full">
                        <div
                            v-for="member in pageProps.project.users ?? []"
                            class="w-full flex flex-row justify-start items-center space-x-2"
                        >
                            <img
                                :src="`https://ui-avatars.com/api/?name=${encodeURI(member.fullName)}&size=32`"
                                :alt="member.fullName"
                                class="size-8 rounded-full"
                            />
                            <span class="inline-block">{{ member.fullName }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ProjectCategory
                class="flex-1 min-h-full h-auto"
                v-model="categories"
                :project-id="pageProps.project.id"
                :allow-sorting="can(pageProps.capabilities, Permissions.PROJECT_CATEGORY_ORDER)"
                :allow-editing="can(pageProps.capabilities, Permissions.PROJECT_CATEGORY_EDIT)"
                :allow-deleting="can(pageProps.capabilities, Permissions.PROJECT_CATEGORY_DELETE)"
                :allow-task-sorting="can(pageProps.capabilities, Permissions.PROJECT_TASK_ORDER)"
                :allow-creating-task="can(pageProps.capabilities, Permissions.PROJECT_TASK_CREATE)"
                :allow-editing-task="can(pageProps.capabilities, Permissions.PROJECT_TASK_EDIT)"
                :allow-deleting-task="can(pageProps.capabilities, Permissions.PROJECT_TASK_DELETE)"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { InferPageProps } from '@adonisjs/inertia/types'
import type DashboardController from '#controllers/dashboard_controller'
import type { CategoryDto } from '#types/category.dto'
import type { TagDto } from '#types/tag.dto'
import type { TaskDto } from '#types/task.dto'

import { usePage, Head, router } from '@inertiajs/vue3'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { ref } from 'vue'
import { Subscription } from '@adonisjs/transmit-client'
import { transmit } from '~/utils/transmit'

import ProjectHeader from '~/components/projects/header.vue'
import ProjectCategory from '~/components/projects/categories.vue'
import { can } from '~/utils/can'
import { Permissions } from '~/utils/permission_enum'

import { PlusIcon } from '@heroicons/vue/24/solid'

import ProjectTagCreateDialog from '~/components/projects/editing/create_tag_dialog.vue'
import ProjectTaskDialog from '~/components/projects/task_detail.vue'
import TagDraggable from '~/components/projects/tag_draggable.vue'

let categorySubscription: Subscription | null = null
let tagSubscription: Subscription | null = null

const page = usePage<InferPageProps<DashboardController, 'project' | 'task'>>()
const pageProps = computed(() => page.props)

const categories = ref<CategoryDto[]>(pageProps.value.project.categories ?? [])
const tags = ref<TagDto[]>(pageProps.value.project.tags ?? [])

const tagCreateDialog = ref(false)

const onTaskDetailClose = () => {
    router.get(
        `/dashboard/projects/${pageProps.value.project.id}`,
        {},
        { preserveState: true, preserveScroll: true }
    )
}

watch(
    () => pageProps.value.project.categories,
    (value) => {
        categories.value = value as CategoryDto[]
    }
)

onMounted(async () => {
    categorySubscription = transmit.instance.subscription(
        `/projects/${pageProps.value.project.id}/categories`
    )

    tagSubscription = transmit.instance.subscription(`/projects/${pageProps.value.project.id}/tags`)

    await categorySubscription.create()
    await tagSubscription.create()

    categorySubscription.onMessage<{
        type: 'category.reorder' | 'category.update' | 'category.delete' | 'category.create'
        categories?: CategoryDto[]
        category?: CategoryDto
        id?: number
    }>((data) => {
        if (data.type === 'category.reorder' && data.categories) {
            categories.value = data.categories
        }

        if (data.type === 'category.update') {
            const index = categories.value.findIndex(
                (category) => category.id === data.category?.id
            )

            if (index == -1) {
                return
            }

            categories.value[index] = data.category as CategoryDto
        }

        if (data.type === 'category.delete' && data.id) {
            const index = categories.value.findIndex((category) => category.id === data.id)

            if (index == -1) {
                return
            }

            categories.value.splice(index, 1)
        }

        if (data.type === 'category.create' && data.category) {
            categories.value.push(data.category as CategoryDto)
            categories.value.sort((a, b) => a.order - b.order)
        }
    })

    tagSubscription.onMessage<{ type: 'tag.created' | 'tag.deleted' | 'tag.updated'; tag: TagDto }>(
        (data) => {
            if (data.type === 'tag.created' && data.tag) {
                tags.value.push(data.tag)
            }

            if (data.type === 'tag.deleted' && data.tag) {
                const index = tags.value.findIndex((tag) => tag.id === data.tag.id)

                if (index == -1) {
                    return
                }

                tags.value.splice(index, 1)
            }

            if (data.type === 'tag.updated' && data.tag) {
                const index = tags.value.findIndex((tag) => tag.id === data.tag.id)

                if (index == -1) {
                    return
                }

                tags.value[index] = data.tag
            }
        }
    )
})

onBeforeUnmount(async () => {
    if (categorySubscription) {
        await categorySubscription.delete()
    }

    if (tagSubscription) {
        await tagSubscription.delete()
    }
})
</script>
