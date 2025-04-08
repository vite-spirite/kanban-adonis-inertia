<template>
    <Head :title="pageProps.project.name" />

    <div class="flex flex-col w-full">
        <ProjectHeader :project="pageProps.project" :capabilities="pageProps.capabilities" />

        <div class="flex-1 w-full relative pt-12 h-full">
            <ProjectCategory
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

import { usePage, Head } from '@inertiajs/vue3'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { ref } from 'vue'
import { Subscription, Transmit } from '@adonisjs/transmit-client'

import ProjectHeader from '~/components/projects/header.vue'
import ProjectCategory from '~/components/projects/categories.vue'
import { can } from '~/utils/can'
import { Permissions } from '~/utils/permission_enum'

let subscription: Subscription | null = null

const page = usePage<InferPageProps<DashboardController, 'project'>>()
const pageProps = computed(() => page.props)

const categories = ref<CategoryDto[]>(pageProps.value.project.categories ?? [])

watch(
    () => pageProps.value.project.categories,
    (value) => {
        categories.value = value ?? []
    }
)

onMounted(async () => {
    const transmit = new Transmit({
        baseUrl: window.location.origin,
    })

    subscription = transmit.subscription(`/projects/${pageProps.value.project.id}/categories`)

    await subscription.create()

    subscription.onMessage<{
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
})

onBeforeUnmount(async () => {
    if (subscription) {
        await subscription.delete()
    }
})
</script>
