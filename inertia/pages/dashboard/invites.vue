<template>
    <Head title="Invitations" />

    <div class="max-w-screen-2xl mx-auto w-full py-12">
        <h2 class="font-bold text-3xl font-bold leading-tight text-gray-900 w-full text-left">
            Invites
        </h2>

        <p v-if="invites.length <= 0" class="text-gray-600 mt-2">
            You have no invites yet. Invite your friends to join you on your projects.
        </p>

        <div class="w-full mt-6 flex flex-col justify-start items-start divide-y divide-gray-200">
            <div
                v-for="invite in invites"
                :key="invite.token"
                class="flex flex-row justify-between items-center w-full py-4"
            >
                <div class="flex flex-col justify-start items-start space-y-2">
                    <h3 class="font-bold text-xl leading-tight text-gray-900">
                        {{ invite.project?.name }}
                    </h3>
                    <span class="text-sm leading-tight text-gray-900">{{
                        formatDate(invite.createdAt)
                    }}</span>
                </div>

                <div class="flex flex-row justify-end items-center space-x-4">
                    <Link
                        :href="`/dashboard/invites/${invite.token}`"
                        class="bg-green-100 hover:bg-green-200 transition text-green-900 font-medium text-sm px-4 py-2 rounded-lg cursor-pointer"
                        >Accept</Link
                    >

                    <Link
                        :href="`/dashboard/invites/${invite.token}/reject`"
                        class="bg-red-100 hover:bg-red-200 transition text-red-900 font-medium text-sm px-4 py-2 rounded-lg cursor-pointer"
                        >Reject</Link
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Link, usePage, Head } from '@inertiajs/vue3'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { InferPageProps } from '@adonisjs/inertia/types'
import type UsersController from '#controllers/users_controller'
import type { InviteDto } from '#types/invite.dto'

import { DateTime } from 'luxon'
import { type Subscription } from '@adonisjs/transmit-client'
import { transmit } from '~/utils/transmit'

const page = usePage<InferPageProps<UsersController, 'showInvite'>>()
const pageProps = computed(() => page.props)

const invites = ref<InviteDto[]>((pageProps.value.invites as InviteDto[]) ?? [])
let subscription: Subscription | null = null

const formatDate = (date: string) => {
    return DateTime.fromISO(date).toFormat('dd LLL yyyy')
}

onMounted(async () => {
    if (!pageProps.value.user) {
        return
    }

    subscription = transmit.instance.subscription(`/user/${pageProps.value.user.id}/invites`)
    await subscription.create()

    subscription.onMessage<{ type: 'add' | 'delete'; invite: InviteDto }>((data) => {
        if (data.type === 'add') {
            invites.value.push(data.invite)
        } else if (data.type === 'delete') {
            invites.value = [...invites.value.filter((invite) => invite.id !== data.invite.id)]
        }
    })
})

onBeforeUnmount(async () => {
    if (subscription) {
        await subscription.delete()
        subscription = null
    }
})
</script>
