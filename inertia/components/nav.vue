<template>
    <nav class="w-full flex flex-row justify-between items-center px-4 py-6">
        <div class="flex flex-row justify-start items-center">
            <Link href="/" class="uppercase font-open-sans text-2xl">Logo</Link>
        </div>

        <div class="flex flex-row justify-start items-center space-x-4">
            <Link
                v-if="!pageProps.user"
                href="/login"
                class="font-roboto text-xl font-medium bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition-all"
                >Login</Link
            >

            <Link
                v-if="!pageProps.user"
                href="/register"
                class="font-roboto text-xl font-medium px-4 py-2 rounded-md text-gray-100 bg-blue-500 hover:bg-blue-400 transition-all"
                :class="{ '!bg-blue-400': $page.url === '/register' }"
                >Register</Link
            >
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { Link, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'

const page = usePage()
const pageProps = computed(() => page.props)
</script>
