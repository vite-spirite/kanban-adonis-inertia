<template>
    <Head title="Edit project" />

    <div class="w-full h-full">
        <ProjectHeader :project="pageProps.project" :capabilities="pageProps.capabilities" />

        <div class="py-12 md:px-0 px-4">
            <div class="max-w-screen-md mx-auto">
                <h2 class="text-2xl font-semibold text-gray-800">General</h2>

                <form
                    class="flex flex-col justify-start items-start space-y-6 mt-6"
                    @submit.prevent="submit"
                >
                    <div class="flex flex-col justify-start items-start w-full">
                        <label for="projectName">Project:</label>
                        <input
                            type="text"
                            id="projectName"
                            name="projectName"
                            v-model="form.name"
                            class="w-full p-2 border border-gray-200 rounded-lg"
                        />
                    </div>

                    <div class="flex flex-col justify-start items-start w-full">
                        <label for="projectImage">Image:</label>
                        <input
                            type="file"
                            id="projectImage"
                            name="projectImage"
                            class="w-full p-2 border border-gray-200 rounded-lg"
                            @input="form.image = ($event.target as any).files[0]"
                        />
                    </div>
                    <div class="flex flex-row justify-start items-center w-full space-x-4">
                        <label for="projectVisibility">Public board:</label>

                        <Switch
                            v-model="form.public"
                            :class="form.public ? 'bg-green-500' : 'bg-gray-200'"
                            class="relative inline-flex h-6 w-11 items-center rounded-full"
                        >
                            <span
                                :class="form.public ? 'translate-x-6' : 'translate-x-1'"
                                class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                            />
                        </Switch>
                    </div>

                    <div class="flex flex-row justify-end items-start w-full">
                        <button
                            type="submit"
                            class="py-2 px-6 border-gray-200 rounded-lg border-2 border-dashed hover:bg-blue-500 focus:outline-none hover:border-transparent transition hover:text-gray-50 font-medium cursor-pointer"
                            @click.prevent="submit"
                        >
                            Save change
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { InferPageProps } from '@adonisjs/inertia/types'
import type DashboardController from '#controllers/dashboard_controller'

import { Switch } from '@headlessui/vue'
import { Head, useForm, usePage } from '@inertiajs/vue3'
import ProjectHeader from '~/components/projects/header.vue'
import { computed } from 'vue'

const page = usePage<InferPageProps<DashboardController, 'edit'>>()
const pageProps = computed(() => page.props)

const form = useForm({
    name: pageProps.value.project.name,
    image: null,
    public: pageProps.value.project.public,
})

const submit = async () => {
    form.put(`/dashboard/projects/${pageProps.value.project.id}`, { forceFormData: true })
}
</script>
