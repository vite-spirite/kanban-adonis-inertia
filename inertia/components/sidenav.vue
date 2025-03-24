<template>
    <div
        class="min-h-screen w-1/10 flex flex-col justify-start items-start overflow-y-auto bg-gray-100 rounded-r-2xl p-2 space-y-5"
    >
        <div class="pb-0 pt-4 w-full text-left px-2">
            <Link href="/">LOGO</Link>
        </div>

        <div class="flex flex-col justify-start items-start p-2 w-full space-y-2">
            <div class="flex flex-row justify-start items-center w-full space-x-2">
                <h1 class="font-medium text-md leading-tight text-gray-400">{{ user.fullName }}</h1>
                <div class="flex-1 w-full h-[1px] bg-gray-400 block"></div>
            </div>

            <ul class="flex flex-col justify-center items-start text-gray-400 space-y-2 w-full">
                <li class="w-full">
                    <Link
                        href="/"
                        class="inline-block w-full hover:bg-black/5 rounded-lg p-2 hover:text-gray-500 transition"
                        >items 1</Link
                    >
                </li>
                <li class="w-full">
                    <Link
                        href="/"
                        class="inline-block w-full hover:bg-black/5 rounded-lg p-2 hover:text-gray-500 transition"
                        >items 2</Link
                    >
                </li>
                <li class="w-full">
                    <Link
                        href="/logout"
                        class="inline-block w-full hover:bg-red-500 rounded-lg p-2 hover:text-gray-200 transition"
                        >Logout</Link
                    >
                </li>
            </ul>
        </div>

        <div class="flex flex-col justify-start items-start p-2 w-full space-y-2">
            <div class="flex flex-row justify-start items-center w-full space-x-2">
                <h1 class="font-medium text-md leading-tight text-gray-400">Projects</h1>
                <div class="flex-1 w-full h-[1px] bg-gray-400 block"></div>
            </div>

            <ul class="flex flex-col justify-center items-start text-gray-400 space-y-2 w-full">
                <li class="w-full">
                    <Link
                        href="/"
                        class="inline-block w-full hover:bg-black/5 rounded-lg p-2 hover:text-gray-500 transition"
                        >Project 1</Link
                    >
                </li>
                <li class="w-full">
                    <Link
                        href="/"
                        class="inline-block w-full hover:bg-black/5 rounded-lg p-2 hover:text-gray-500 transition"
                        >Project 2</Link
                    >
                </li>
                <li class="w-full">
                    <Link
                        href="/"
                        class="inline-block w-full hover:bg-black/5 rounded-lg p-2 hover:text-gray-500 transition"
                        >Project 3</Link
                    >
                </li>

                <li class="w-full">
                    <Link
                        href="/"
                        class="inline-block w-full border-2 border-dashed border-gray-200 text-center hover:bg-blue-500 rounded-lg p-2 hover:text-gray-200 hover:border-transparent transition"
                        >Create new project</Link
                    >
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type User from '#models/user'

import { Link } from '@inertiajs/vue3'

const { user } = defineProps<{ user: User }>()

console.log(user)
</script>
