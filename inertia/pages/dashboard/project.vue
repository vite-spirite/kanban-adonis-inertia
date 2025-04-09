<template>
    <Head :title="pageProps.project.name" />

    <div class="flex flex-col w-full max-w-screen">
        <ProjectHeader :project="pageProps.project" :capabilities="pageProps.capabilities" />

        <ProjectTagCreateDialog
            v-if="can(pageProps.capabilities, Permissions.PROJECT_TAG_CREATE)"
            :project-id="pageProps.project.id"
            :show="tagCreateDialog"
            @close="tagCreateDialog = false"
        />

        <div
            class="flex-1 w-full relative h-full flex flex-row justify-start items-start max-w-screen"
        >
            <div class="w-1/8 p-4 h-full bg-gray-100">
                <div class="flex flex-col justify-items-start items-start space-y-4">
                    <h3 class="font-semibold text-lg text-gray-800">Tags:</h3>

                    <div class="flex flex-row justify-start items-center gap-2 flex-wrap">
                        <ProjectTag
                            v-for="tag in tags"
                            :key="`project_${pageProps.project.id}_tag_${tag.id}_editable`"
                            :tag="tag"
                            :editable="can(pageProps.capabilities, Permissions.PROJECT_TAG_EDIT)"
                            :removable="can(pageProps.capabilities, Permissions.PROJECT_TAG_DELETE)"
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
                </div>
            </div>

            <ProjectCategory
                class="flex-1 py-6"
                v-model="categories"
                :project-id="pageProps.project.id"
                :allow-sorting="can(pageProps.capabilities, Permissions.PROJECT_CATEGORY_ORDER)"
                :allow-editing="can(pageProps.capabilities, Permissions.PROJECT_CATEGORY_EDIT)"
                :allow-deleting="can(pageProps.capabilities, Permissions.PROJECT_CATEGORY_DELETE)"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { InferPageProps } from '@adonisjs/inertia/types'
import type DashboardController from '#controllers/dashboard_controller'
import type { CategoryDto } from '#types/category.dto'
import type { TagDto } from '#types/tag.dto'

import { usePage, Head } from '@inertiajs/vue3'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { ref } from 'vue'
import { Subscription, Transmit } from '@adonisjs/transmit-client'

import ProjectHeader from '~/components/projects/header.vue'
import ProjectCategory from '~/components/projects/categories.vue'
import { can } from '~/utils/can'
import { Permissions } from '~/utils/permission_enum'

import { PlusIcon } from '@heroicons/vue/24/solid'

import ProjectTag from '~/components/projects/tag.vue'
import ProjectTagCreateDialog from '~/components/projects/editing/create_tag_dialog.vue'

let categorySubscription: Subscription | null = null
let tagSubscription: Subscription | null = null

const page = usePage<InferPageProps<DashboardController, 'project'>>()
const pageProps = computed(() => page.props)

const categories = ref<CategoryDto[]>(pageProps.value.project.categories ?? [])
const tags = ref<TagDto[]>(pageProps.value.project.tags ?? [])

const tagCreateDialog = ref(false)

onMounted(async () => {
    const transmit = new Transmit({
        baseUrl: window.location.origin,
    })

    categorySubscription = transmit.subscription(
        `/projects/${pageProps.value.project.id}/categories`
    )

    tagSubscription = transmit.subscription(`/projects/${pageProps.value.project.id}/tags`)

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
