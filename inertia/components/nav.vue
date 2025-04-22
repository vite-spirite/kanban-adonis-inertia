<template>
    <div class="h-auto w-full">
        <nav
            class="w-full flex flex-row justify-between items-center px-4 py-6 bg-gray-50 min-h-[86px]"
        >
            <div class="mx-auto container w-full flex flex-row justify-between items-center">
                <Link
                    href="/"
                    class="relative z-10 h-full flex flex-row justify-start items-center px-4"
                >
                    <img src="/public/logo.svg" alt="logo" />
                </Link>

                <div class="flex flex-row justify-between items-center space-x-4">
                    <Link
                        v-if="!pageProps.user"
                        href="/login"
                        class="border border-gray-100 rounded-md px-4 py-2 font-medium text-sm hover:bg-gray-100 text-gray-950 transition"
                        >Log in</Link
                    >
                    <Link
                        v-if="!pageProps.user"
                        href="/register"
                        class="border border-gray-900 bg-gray-900 rounded-md px-4 py-2 font-medium text-sm hover:bg-gray-800 text-gray-50 transition"
                        >Register</Link
                    >
                    <Link
                        v-if="pageProps.user"
                        href="/dashboard"
                        class="border border-blue-100 bg-blue-100 text-blue-900 rounded-md px-4 py-2 font-medium text-sm hover:border-blue-400 hover:bg-blue-400 hover:text-gray-50 transition"
                        >Dashboard</Link
                    >
                    <Link
                        v-if="pageProps.user"
                        href="/logout"
                        class="border border-red-100 bg-red-100 rounded-md px-4 py-2 font-medium text-sm text-red-900 hover:border-red-400 hover:bg-red-400 hover:text-gray-50 transition"
                        >Log out</Link
                    >
                </div>
            </div>
        </nav>
    </div>
</template>

<script lang="ts" setup>
import { Link, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'

const page = usePage()
const pageProps = computed(() => page.props)
</script>
