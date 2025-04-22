<template>
    <Head title="Kanban Board" />

    <div class="max-h-screen h-screen w-full overflow-auto">
        <Navigation />

        <div class="w-full bg-gradient-to-b from-blue-100 to-purple-100">
            <div class="container w-full mx-auto">
                <div
                    class="flex flex-row justify-center items-center h-full w-full py-24 space-x-4"
                >
                    <div class="flex flex-col justify-start items-start max-w-1/2 w-full space-y-6">
                        <h1 class="font-bold text-5xl">
                            Your tasks, <span class="text-purple-500">organized</span> with
                            simplicity.
                        </h1>

                        <p class="text-xl text-gray-900">
                            Streamline your workflow with our intuitive Kanban board. Visualize
                            projects, manage tasks, and boost productivity in one beautiful
                            interface.
                        </p>

                        <Link
                            :href="pageProps.user ? '/dashboard' : '/login'"
                            class="flex flex-row justify-center items-center bg-purple-500 text-white rounded-md px-4 py-3 font-medium text-sm hover:bg-purple-600 transition space-x-2"
                        >
                            <span v-if="pageProps.user" class="inline-block h-full"
                                >Go to Dashboard</span
                            >
                            <span v-else class="inline-block h-full">Get Started</span>
                            <ArrowRightIcon class="h-4 w-4" />
                        </Link>
                    </div>

                    <div class="w-full max-w-1/2 p-6">
                        <div class="relative w-full h-full">
                            <div
                                class="absolute w-full h-full opacity-80 bg-purple-200 rounded-xl bottom-4 right-4"
                            ></div>

                            <div
                                class="absolute w-full h-full opacity-80 bg-blue-200 rounded-xl top-4 left-4"
                            ></div>

                            <img
                                src="/public/preview.webp"
                                alt="preview"
                                class="mx-auto rounded-xl w-full relative z-10"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="container mx-auto w-full py-12 flex flex-col justify-center items-center space-y-6"
        >
            <h1 class="font-bold text-4xl">Everything you need for efficient task management</h1>
            <p class="text-xl text-gray-500 w-1/2 text-center">
                Our Kanban board offers powerful yet simple tools to help teams organize work and
                achieve their goals.
            </p>

            <div class="w-full grid grid-cols-3 gap-6 mt-6">
                <div class="card w-full rounded-lg shadow-md hover:shadow-lg p-6 transition">
                    <div class="flex flex-row justify-start items-center space-x-4">
                        <div class="p-2 rounded-md bg-purple-100">
                            <ViewColumnsIcon class="h-6 w-6 text-purple-500" />
                        </div>
                        <h2 class="font-semibold text-xl">Visual Workflow</h2>
                    </div>
                    <p class="text-gray-500 mt-4">
                        Visualize your project progress with customizable columns that represent
                        each stage of your workflow.
                    </p>
                </div>

                <div class="card w-full rounded-lg shadow-md hover:shadow-lg p-6 transition">
                    <div class="flex flex-row justify-start items-center space-x-4">
                        <div class="p-2 rounded-md bg-purple-100">
                            <TagIcon class="h-6 w-6 text-purple-500" />
                        </div>
                        <h2 class="font-semibold text-xl">Custom Categories</h2>
                    </div>
                    <p class="text-gray-500 mt-4">
                        Create and color-code categories to organize tasks by project, priority, or
                        department.
                    </p>
                </div>

                <div class="card w-full rounded-lg shadow-md hover:shadow-lg p-6 transition">
                    <div class="flex flex-row justify-start items-center space-x-4">
                        <div class="p-2 rounded-md bg-purple-100">
                            <CalendarIcon class="h-6 w-6 text-purple-500" />
                        </div>
                        <h2 class="font-semibold text-xl">Due Date Tracking</h2>
                    </div>
                    <p class="text-gray-500 mt-4">
                        Never miss a deadline with clear due date displays and upcoming task
                        notifications.
                    </p>
                </div>

                <div class="card w-full rounded-lg shadow-md hover:shadow-lg p-6 transition">
                    <div class="flex flex-row justify-start items-center space-x-4">
                        <div class="p-2 rounded-md bg-purple-100">
                            <UsersIcon class="h-6 w-6 text-purple-500" />
                        </div>
                        <h2 class="font-semibold text-xl">Team Collaboration</h2>
                    </div>
                    <p class="text-gray-500 mt-4">
                        Assign tasks, add comments, and keep everyone on the same page with
                        real-time updates.
                    </p>
                </div>

                <div class="card w-full rounded-lg shadow-md hover:shadow-lg p-6 transition">
                    <div class="flex flex-row justify-start items-center space-x-4">
                        <div class="p-2 rounded-md bg-purple-100">
                            <UserIcon class="h-6 w-6 text-purple-500" />
                        </div>
                        <h2 class="font-semibold text-xl">Role based</h2>
                    </div>
                    <p class="text-gray-500 mt-4">
                        Assign different roles to team members, ensuring that everyone has the right
                        access and permissions.
                    </p>
                </div>

                <div class="card w-full rounded-lg shadow-md hover:shadow-lg p-6 transition">
                    <div class="flex flex-row justify-start items-center space-x-4">
                        <div class="p-2 rounded-md bg-purple-100">
                            <ArrowsRightLeftIcon class="h-6 w-6 text-purple-500" />
                        </div>
                        <h2 class="font-semibold text-xl">Drag & Drop</h2>
                    </div>
                    <p class="text-gray-500 mt-4">
                        Effortlessly move tasks between status columns as your work progresses.
                    </p>
                </div>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script lang="ts" setup>
import type { InferPageProps } from '@adonisjs/inertia/types'
import type HomeController from '#controllers/home_controller'
import { Head, usePage, Link } from '@inertiajs/vue3'

import { ArrowRightIcon } from '@heroicons/vue/24/solid'
import {
    ViewColumnsIcon,
    TagIcon,
    CalendarIcon,
    UsersIcon,
    UserIcon,
    ArrowsRightLeftIcon,
} from '@heroicons/vue/24/outline'

import Navigation from '~/components/nav.vue'
import Footer from '~/components/footer.vue'
import { computed } from 'vue'

const page = usePage<InferPageProps<HomeController, 'index'>>()
const pageProps = computed(() => page.props)
</script>
