<template>
    <div class="w-full">
        <form class="flex flex-col justify-start items-start space-y-2" @submit.prevent="submit">
            <div class="flex flex-col justify-start items-start w-full">
                <label for="projectName">Project:</label>
                <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    v-model="form.name"
                    class="w-full p-2 border border-gray-200 rounded-lg"
                />
            </div>

            <div class="flex flex-col justify-start items-start w-full">
                <label for="projectImage">Image:</label>
                <input
                    type="file"
                    id="projectImage"
                    name="projectImage"
                    class="w-full p-2 border border-gray-200 rounded-lg"
                    @input="form.image = ($event.target as any).files[0]"
                />
            </div>

            <div class="flex flex-col justify-start items-start w-full">
                <button
                    type="submit"
                    class="py-2 px-6 border-gray-200 rounded-lg border-2 border-dashed hover:bg-blue-500 focus:outline-none hover:border-transparent transition hover:text-gray-50 font-medium cursor-pointer"
                    @click.prevent="submit"
                >
                    Save change
                </button>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import type { ProjectDto } from '#types/project.dto'
import { useForm } from '@inertiajs/vue3'
import { watch } from 'vue'

const { project } = defineProps<{ project: ProjectDto }>()

const form = useForm({
    name: project.name,
    image: project.image,
})

watch(form, () => {
    console.log(form)
})

const submit = async () => {
    form.put(`/dashboard/projects/${project.id}`, { forceFormData: true })
}
</script>
