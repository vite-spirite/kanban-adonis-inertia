<template>
    <Head title="Login" />

    <div
        class="w-full h-screen min-h-screen overflow-auto flex flex-col justify-start items-center"
    >
        <Navigation />

        <div class="flex-1 flex flex-col justify-center items-center w-full py-6">
            <div class="max-w-screen-sm w-full rounded-lg shadow-md p-6 border border-gray-200">
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
                        <label for="password" class="font-roboto font-normal font-xl"
                            >Password:</label
                        >
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

        <Footer />
    </div>
</template>

<script lang="ts" setup>
import type { LoginDto } from '#services/user_service'

import { Switch } from '@headlessui/vue'
import { Head, useForm, Link } from '@inertiajs/vue3'
import Navigation from '~/components/nav.vue'
import Footer from '~/components/footer.vue'

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
