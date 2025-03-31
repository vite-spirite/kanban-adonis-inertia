<template>
    <div class="w-full grid grid-cols-4 gap-4">
        <MemberRoleEdit
            v-for="user in users"
            :key="`role_edit_user_${user.id}`"
            :roles="roles"
            :user="user"
            :project="project"
        />
    </div>
</template>

<script lang="ts" setup>
import type { PermissionDto } from '#types/permission.dto'
import type { UserDto } from '#types/user.dto'
import type { RoleDto } from '#types/role.dto'
import type { ProjectDto } from '#types/project.dto'

import MemberRoleEdit from '~/components/projects/editing/member.vue'

const { users, roles, project } = defineProps<{
    users: UserDto[]
    capabilities: PermissionDto[]
    roles: RoleDto[]
    project: ProjectDto
}>()
</script>
