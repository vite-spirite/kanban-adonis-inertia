<template>
    <Head title="Register" />

    <div class="w-full h-min-screen">
        <Navigation />

        <div
            class="xl:w-xl mx-auto border-dashed border-gray-200 border-4 rounded-lg px-4 py-2 mt-20"
        >
            <h1 class="font-bold font-open-sans text-2xl">Register</h1>

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
                        :class="{ '!border-red-500': form.errors.email }"
                    />
                    <span class="text-red-500 font-medium" v-if="form.errors.email">{{
                        form.errors.email
                    }}</span>
                </div>

                <div class="flex flex-col justify-start items-start w-full space-y-1">
                    <label for="full_name" class="font-roboto font-normal font-xl"
                        >Full name:</label
                    >
                    <input
                        v-model="form.fullName"
                        type="text"
                        name="full_name"
                        id="full_name"
                        class="border-2 text-gray-900 border-gray-200 rounded-md p-2 w-full outline-0 focus:border-blue-500 transition"
                        :class="{ '!border-red-500': form.errors.fullName }"
                    />
                    <span class="text-red-500 font-medium" v-if="form.errors.fullName">{{
                        form.errors.fullName
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
                        :class="{ '!border-red-500': form.errors.password }"
                    />
                    <span class="text-red-500 font-medium" v-if="form.errors.password">{{
                        form.errors.password
                    }}</span>
                </div>

                <div class="flex flex-col justify-start items-start w-full space-y-1">
                    <label for="password_confirmation" class="font-roboto font-normal font-xl"
                        >Confirmation:</label
                    >
                    <input
                        v-model="form.password_confirmation"
                        type="password"
                        name="password_confirmation"
                        id="password_confirmation"
                        class="border-2 text-gray-900 border-gray-200 rounded-md p-2 w-full outline-0 focus:border-blue-500 transition"
                        :class="{ '!border-red-500': form.errors.password_confirmation }"
                    />
                    <span
                        class="text-red-500 font-medium"
                        v-if="form.errors.password_confirmation"
                        >{{ form.errors.password_confirmation }}</span
                    >
                </div>

                <button
                    @click="submit"
                    type="submit"
                    class="bg-blue-500 text-gray-100 font-roboto font-medium rounded-md p-2 w-full hover:bg-blue-400 transition cursor-pointer"
                >
                    Register
                </button>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { RegisterDto } from '#services/user_service'
import { Head, useForm } from '@inertiajs/vue3'
import Navigation from '~/components/nav.vue'

const form = useForm<RegisterDto & { password_confirmation: string }>({
    email: '',
    fullName: '',
    password: '',
    password_confirmation: '',
})

const submit = () => {
    form.post('/register')
}
</script>
