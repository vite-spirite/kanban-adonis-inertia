<template>
    <Head :title="`${task.name}`" />

    <TransitionRoot appear :show="show" as="template">
        <Dialog as="div" @close="emit('close')" class="relative z-50">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel
                            class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
                        >
                            <DialogTitle
                                as="div"
                                class="text-lg leading-6 font-medium text-gray-900 p-6 w-full border-b-2 border-gray-200 flex flex-row justify-start items-center space-x-6"
                            >
                                <ServerIcon class="h-6 w-6 text-gray-500" />

                                <div
                                    class="flex flex-col justify-start items-start space-y-2 w-full"
                                >
                                    <input
                                        type="text"
                                        class="m-0 p-0 text-xl font-medium bg-none focus:outline-blue-500 transition border-none w-full rounded-md"
                                        v-model="taskForm.name"
                                        :disabled="!allowEditable"
                                        @change="saveTaskDebounced"
                                    />
                                    <h5 class="text-sm text-gray-800 font-normal">
                                        in {{ task.category?.name }}
                                    </h5>
                                </div>
                            </DialogTitle>

                            <div class="flex flex-row justify-start items-stretch space-x-6 h-full">
                                <div
                                    class="flex flex-col justify-start items-start space-y-6 flex-1 p-4"
                                >
                                    <div
                                        class="flex flex-col justify-start items-start space-y-2"
                                        v-if="taskForm.dueDate"
                                    >
                                        <div
                                            class="flex flex-row justify-start items-center text-gray-600 space-x-2"
                                        >
                                            <ClockIcon class="h-6 w-6" />
                                            <h4 class="m-0 p-0 font-semibold text-lg">Dates</h4>
                                        </div>
                                        <div
                                            class="flex flex-row justify-start items-center flex-wrap pl-8 gap-1"
                                        >
                                            <span class="text-sm text-gray-500 font-normal">
                                                {{ computeDate(task.createdAt) }}
                                            </span>

                                            <span class="text-sm text-gray-500 font-normal">-</span>

                                            <input
                                                class="text-sm text-gray-500 font-normal"
                                                id="due-date"
                                                type="datetime-local"
                                                v-model="taskForm.dueDate"
                                                @change="saveTaskDebounced"
                                            />
                                        </div>
                                    </div>

                                    <div
                                        class="flex flex-col justify-start items-start space-y-2 w-full"
                                    >
                                        <div
                                            class="flex flex-row justify-start items-center text-gray-600 space-x-2"
                                        >
                                            <TagIcon class="h-6 w-6" />
                                            <h4 class="m-0 p-0 font-semibold text-lg">Tags</h4>
                                        </div>
                                        <vuedraggable
                                            class="flex flex-row justify-start items-start gap-2 w-full flex-wrap min-h-[5px] pl-8"
                                            group="task_tag"
                                            v-model="currentTask.tags"
                                            item-key="id"
                                            :disabled="!allowEditable"
                                            @change="onTagChanged"
                                        >
                                            <template #item="{ element: tag }">
                                                <div>
                                                    <Tag
                                                        :tag="tag"
                                                        :editable="false"
                                                        :removable="false"
                                                    />
                                                </div>
                                            </template>
                                        </vuedraggable>
                                    </div>

                                    <div
                                        class="flex flex-col justify-start items-start space-y-2 w-full"
                                    >
                                        <div
                                            class="flex flex-row justify-start items-center space-x-2 text-gray-600 w-full"
                                        >
                                            <Bars3CenterLeftIcon class="h-6 w-6" />
                                            <h4 class="m-0 p-0 font-semibold text-lg">
                                                Description
                                            </h4>
                                        </div>
                                        <div class="w-full pl-8">
                                            <textarea
                                                ref="descriptionTextareaReference"
                                                v-model="taskForm.description"
                                                class="text-sm text-gray-500 font-normal w-full resize-y focus:outline-blue-500 transition h-full"
                                                :disabled="!allowEditable"
                                                @change="saveTaskDebounced"
                                                @input="adjustTextareaHeight"
                                            >
                                            </textarea>
                                        </div>
                                    </div>

                                    <TaskList
                                        v-for="list in currentTask.lists"
                                        :list="list"
                                        :project-id="currentTask.category?.projectId ?? 0"
                                        :task-id="currentTask.id"
                                        :allow-deletable="allowListDeletable"
                                        :allow-editable="allowListEditable"
                                        :allow-check="allowListCheck"
                                    />
                                </div>

                                <div
                                    class="flex flex-col justify-start items-start w-1/3 bg-gray-200 p-4"
                                    v-if="allowEditable"
                                >
                                    <div
                                        class="flex flex-col justify-start items-start space-y-2 w-full"
                                    >
                                        <div
                                            class="flex flex-row justify-start items-center text-gray-600 space-x-2"
                                        >
                                            <TagIcon class="size-4" />
                                            <h4 class="m-0 p-0 font-semibold text-sm">Edit tags</h4>
                                        </div>
                                        <TagDraggable
                                            :tags="tags"
                                            :allow-editable="false"
                                            :allow-deletable="false"
                                            :allow-draggable="allowEditable"
                                        />
                                    </div>

                                    <div
                                        class="flex flex-col justify-start items-start space-y-2 w-full mt-4"
                                    >
                                        <div class="w-full">
                                            <h6 class="text-sm font-medium text-gray-900">
                                                Actions:
                                            </h6>
                                        </div>

                                        <button
                                            v-if="allowEditable"
                                            class="text-sm font-medium text-gray-900 bg-gray-300/50 rounded-md hover:bg-gray-400/25 transition w-full inline-block text-center cursor-pointer"
                                        >
                                            <span
                                                class="text-gray-900 h-full w-full inline-block p-2"
                                                v-if="taskForm.dueDate"
                                                @click="removeTaskDebounced"
                                                >Delete deadline</span
                                            >
                                            <span
                                                class="text-gray-900 h-full w-full inline-block p-2"
                                                v-else
                                                @click="insertNowDate"
                                                >Add deadline</span
                                            >
                                        </button>

                                        <button
                                            v-if="allowListCreate"
                                            class="text-sm font-medium p-2 text-gray-900 bg-gray-300/50 rounded-md hover:bg-gray-400/25 transition w-full inline-block text-center cursor-pointer"
                                            @click="createList"
                                        >
                                            <span class="text-gray-900">Add list</span>
                                        </button>

                                        <button
                                            v-if="allowDeletable"
                                            class="text-sm font-medium text-gray-900 bg-gray-300/50 rounded-md hover:bg-gray-400/25 transition w-full inline-block text-center cursor-pointer"
                                        >
                                            <span
                                                v-if="!talkConfirmDelete"
                                                @click="talkConfirmDelete = true"
                                                class="text-gray-900 p-2 w-full h-full inline-block"
                                                >Delete</span
                                            >

                                            <span
                                                v-else
                                                class="text-red-500 p-2 w-full h-full inline-block"
                                                @click="submitDelete"
                                                >Sure ?</span
                                            >
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script lang="ts" setup>
import type { TaskDto } from '#types/task.dto'
import type { TagDto } from '#types/tag.dto'

import { nextTick, onMounted, ref, watch } from 'vue'
import { DateTime } from 'luxon'
import { Head, router, useForm } from '@inertiajs/vue3'
import { Dialog, TransitionRoot, TransitionChild, DialogTitle, DialogPanel } from '@headlessui/vue'
import { ServerIcon, Bars3CenterLeftIcon, TagIcon, ClockIcon } from '@heroicons/vue/24/outline'

import vuedraggable from 'vuedraggable'
import Tag from '~/components/projects/tag.vue'
import TagDraggable from '~/components/projects/tag_draggable.vue'
import TaskList from '~/components/projects/task_list.vue'
import { useDebounceFn } from '@vueuse/core'
import { Subscription } from '@adonisjs/transmit-client'
import { transmit } from '~/utils/transmit'

const { task } = defineProps<{
    task: TaskDto
    tags: TagDto[]
    allowEditable: boolean
    allowDeletable: boolean
    allowListCreate: boolean
    allowListEditable: boolean
    allowListDeletable: boolean
    allowListCheck: boolean
}>()
const emit = defineEmits<{ (e: 'close'): void }>()

const currentTask = ref<TaskDto>(task)
const show = ref(true)
const talkConfirmDelete = ref(false)

watch(
    () => task,
    () => {
        currentTask.value = task
    }
)

const submitDelete = () => {
    router.delete(`/dashboard/projects/${task.category?.projectId}/tasks/${task.id}`, {
        preserveState: true,
        onSuccess: () => {
            emit('close')
        },
    })
}

const computeDate = (d: string) => {
    const date = DateTime.fromISO(d)
    return date.isValid ? date.toFormat('ff') : 'No due date'
}

let subscription: Subscription | null = null

const tagChangedIds = ref<number[]>([])
const tagForm = useForm<{ tags: { id: number; order: number }[] }>({
    tags: [],
})

const taskForm = useForm<{
    name: string
    description: string
    dueDate?: string | null
}>({
    name: currentTask.value.name,
    description: currentTask.value.description,
    dueDate: currentTask.value.dueDate
        ? DateTime.fromISO(currentTask.value.dueDate).toFormat("yyyy-MM-dd\'T\'HH:mm")
        : undefined,
})

const insertNowDate = () => {
    taskForm.dueDate = DateTime.now().toFormat("yyyy-MM-dd\'T\'HH:mm")
    saveTaskDebounced()
}

const removeTaskDebounced = () => {
    taskForm.dueDate = null
    saveTaskDebounced()
}

const descriptionTextareaReference = ref<HTMLTextAreaElement | null>(null)

const adjustTextareaHeight = () => {
    if (descriptionTextareaReference.value) {
        descriptionTextareaReference.value.style.height = 'auto'
        descriptionTextareaReference.value.style.height = `${descriptionTextareaReference.value.scrollHeight}px`
    }
}

const onTagChanged = async (e: any) => {
    if (e.added) {
        const tag = e.added.element as TagDto
        const tagWithoutAdded = [...currentTask.value.tags]
        tagWithoutAdded.splice(e.added.newIndex, 1)

        if (tagWithoutAdded.find((t) => t.id === tag.id)) {
            currentTask.value.tags.splice(e.added.newIndex, 1)

            return
        }

        tagChangedIds.value.push(e.added.element.id)
    }

    if (e.removed) {
        tagChangedIds.value.push(e.removed.element.id)
    }

    if (e.moved) {
        tagChangedIds.value.push(e.moved.element.id)
    }

    await saveTagChangedDebounced()
}

const saveTagChangedDebounced = useDebounceFn(async () => {
    if (tagChangedIds.value.length === 0) return

    const data: { id: number; order: number }[] = []

    currentTask.value.tags.forEach((tag, index) => {
        data.push({
            id: tag.id,
            order: index,
        })
    })

    tagForm.tags = data

    tagForm.post(`/dashboard/projects/${task.category?.projectId}/tasks/${task.id}/tags`, {
        preserveState: true,
        onSuccess: () => {
            tagChangedIds.value = []
        },
    })
}, 1000)

onMounted(async () => {
    subscription = transmit.instance.subscription(
        `/projects/${task.category?.projectId}/task/${task.id}/details`
    )

    await subscription.create()

    subscription.onMessage<{ type: 'task.updated' | 'task.deleted'; task: TaskDto }>((data) => {
        if (data.type === 'task.updated') {
            currentTask.value = data.task

            taskForm.name = data.task.name
            taskForm.description = data.task.description

            nextTick(() => {
                adjustTextareaHeight()
            })
        }

        if (data.type === 'task.deleted') {
            emit('close')
        }
    })

    nextTick(() => {
        adjustTextareaHeight()
    })
})

const saveTaskDebounced = useDebounceFn(() => {
    if (
        taskForm.name === currentTask.value.name &&
        taskForm.description === currentTask.value.description &&
        taskForm.dueDate === currentTask.value.dueDate
    ) {
        return
    }

    taskForm.put(`/dashboard/projects/${task.category?.projectId}/tasks/${task.id}`, {
        preserveState: true,
        onSuccess: () => {
            currentTask.value.name = taskForm.name
            currentTask.value.description = taskForm.description
        },
    })
}, 1000)

//TODO: add list

const listCreateForm = useForm({
    name: '',
})

const createList = () => {
    listCreateForm.name = `list ${currentTask.value.lists.length + 1}`

    listCreateForm.post(`/dashboard/projects/${task.category?.projectId}/tasks/${task.id}/lists`, {
        preserveState: true,
        onSuccess: () => {
            listCreateForm.name = ''
        },
    })
}

// TODO: add file attachment
// TODO: add activity logs
</script>
