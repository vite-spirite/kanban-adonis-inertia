<template>
    <Head title="Login" />

    <div class="w-full h-min-screen">
        <Navigation />

        <div
            class="xl:w-xl mx-auto border-dashed border-gray-200 border-4 rounded-lg px-4 py-2 mt-20"
        >
            <h1 class="font-bold font-open-sans text-2xl py-2">Login</h1>

            <form
                @submit.prevent="submit"
                method="post"
                class="mt-5 flex flex-col justify-start items-start space-y-4"
            >
                <div class="flex flex-col justify-start items-start w-full space-y-1">
                    <label for="email" class="font-roboto font-normal font-xl">Email:</label>
                    <input
                        v-model="form.email"
                        type="email"
                        name="email"
                        id="email"
                        class="border-2 text-gray-900 border-gray-200 rounded-md p-2 w-full outline-0 focus:border-blue-500 transition"
                        :class="{
                            '!border-red-500': form.errors.email,
                        }"
                    />
                    <span class="text-red-500 font-medium" v-if="form.errors.email">{{
                        form.errors.email
                    }}</span>
                </div>

                <div class="flex flex-col justify-start items-start w-full space-y-1">
                    <label for="password" class="font-roboto font-normal font-xl">Password:</label>
                    <input
                        v-model="form.password"
                        type="password"
                        name="password"
                        id="password"
                        class="border-2 text-gray-900 border-gray-200 rounded-md p-2 w-full outline-0 focus:border-blue-500 transition"
                        :class="{
                            '!border-red-500': form.errors.password,
                        }"
                    />

                    <div class="w-full text-right">
                        <Link href="/" class="text-blue-500">Forgot password?</Link>
                    </div>

                    <span class="text-red-500 font-medium" v-if="form.errors.password">{{
                        form.errors.password
                    }}</span>
                </div>
                <div class="flex flex-row justify-start items-start w-full space-x-5">
                    <span>remember me ?</span>

                    <Switch
                        v-model="form.rememberMe"
                        :class="form.rememberMe ? 'bg-blue-600' : 'bg-gray-200'"
                        class="relative inline-flex h-6 w-11 items-center rounded-full"
                    >
                        <span
                            :class="form.rememberMe ? 'translate-x-6' : 'translate-x-1'"
                            class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                        />
                    </Switch>
                </div>

                <button
                    @click="submit"
                    type="submit"
                    class="bg-blue-500 text-gray-100 font-roboto font-medium rounded-md p-2 w-full hover:bg-blue-400 transition cursor-pointer"
                >
                    Login
                </button>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { LoginDto } from '#services/user_service'

import { Switch } from '@headlessui/vue'
import { Head, useForm, Link } from '@inertiajs/vue3'
import Navigation from '~/components/nav.vue'

const form = useForm<LoginDto>({
    email: '',
    password: '',
    rememberMe: false,
})

const submit = () => {
    form.post('/login', {
        onError: (params) => {
            if (params.E_INVALID_CREDENTIALS) {
                form.errors.email = 'Invalid email or password'
                form.errors.password = 'Invalid email or password'
            }
        },
    })
}
</script>
