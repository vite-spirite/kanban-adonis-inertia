<template>
    <div class="h-full px-4 flex flex-row justify-start items-center">
        <Menu as="div" class="relative inline-block text-left">
            <MenuButton
                class="flex flex-row space-x-1 items-center text-neutral-900 hover:bg-black/15 transition p-2 rounded-lg cursor-pointer"
            >
                <span class="font-semibold font-roboto text-md">{{ user.fullName }}</span>
                <ChevronDownIcon class="size-4" />
            </MenuButton>

            <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
            >
                <MenuItems
                    class="absolute right-0 mt-3 w-56 origin-top-right overflow-hidden border-gray-200 border rounded-lg shadow-lg bg-white flex flex-col justify-start items-start p-2 z-50"
                >
                    <MenuItem
                        v-slot="{ active }"
                        class="w-full py-2 text-neutral-800 font-normal text-sm text-left px-2 rounded-lg"
                    >
                        <a
                            :class="{ 'bg-blue-500 !text-gray-100': active }"
                            class="w-full inline-flex items-start justify-start space-x-2 transition-all"
                            href="/dashboard/projects/create"
                        >
                            <PlusIcon class="size-5" />
                            <span>Create new project</span>
                        </a>
                    </MenuItem>
                    <MenuItem
                        v-slot="{ active }"
                        class="w-full py-2 text-neutral-800 font-normal text-sm text-left px-2 rounded-lg"
                    >
                        <a
                            :class="{ 'bg-blue-500 !text-gray-100': active }"
                            class="w-full inline-flex items-start justify-start space-x-2 transition-all"
                            href="/settings"
                        >
                            <Cog6ToothIcon class="size-5" />
                            <span>Settings</span>
                        </a>
                    </MenuItem>
                    <MenuItem
                        v-slot="{ active }"
                        class="w-full py-2 text-neutral-800 font-normal text-sm text-left px-2 rounded-lg"
                    >
                        <a
                            :class="{ 'bg-blue-500 !text-gray-100': active }"
                            class="w-full inline-flex items-start justify-start space-x-2 transition-all"
                            href="/dashboard/invites"
                        >
                            <div class="flex-1 flex flex-start items-center space-x-2">
                                <EnvelopeIcon class="size-5" />
                                <span>Invitations</span>
                            </div>

                            <span
                                v-if="invites.length > 0"
                                class="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-blue-100 bg-blue-600 rounded-full"
                            >
                                {{ invites.length }}
                            </span>
                        </a>
                    </MenuItem>
                    <MenuItem
                        v-slot="{ active }"
                        class="w-full py-2 text-neutral-800 font-normal text-sm text-left px-2 rounded-lg"
                    >
                        <a
                            :class="{ 'bg-red-500 !text-gray-100': active }"
                            class="w-full inline-flex items-start justify-start space-x-2 transition-all"
                            href="/logout"
                        >
                            <ArrowUturnLeftIcon class="size-5" />
                            <span>Logout</span>
                        </a>
                    </MenuItem>
                </MenuItems>
            </transition>
        </Menu>
    </div>
</template>
<script setup lang="ts">
import type { MeDto } from '#types/user.dto'
import {
    ArrowUturnLeftIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    EnvelopeIcon,
    PlusIcon,
} from '@heroicons/vue/24/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { type Subscription } from '@adonisjs/transmit-client'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { transmit } from '~/utils/transmit'
import type { InviteDto } from '#types/invite.dto'

const { user } = defineProps<{ user: MeDto }>()
const invites = ref<InviteDto[]>([])

let subscription: Subscription | null = null

onMounted(async () => {
    console.log(transmit)
    subscription = transmit.instance.subscription(`/user/${user.id}/invites`)
    await subscription.create()

    subscription.onMessage<{ type: 'add' | 'delete'; invite: InviteDto }>((data) => {
        if (data.type === 'add') {
            invites.value.push(data.invite)
        } else if (data.type === 'delete') {
            invites.value = invites.value.filter((invite) => invite.id !== data.invite.id)
        }
    })
})

onBeforeUnmount(async () => {
    if (subscription) {
        await subscription.delete()
        subscription = null
    }
})

invites.value = user.invites
</script>
