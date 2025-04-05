export const PermissionDescription: Record<string, { title: string; description: string }> = {
    'project:edit': {
        title: 'Edit project',
        description: 'Edit project description, name, and other details',
    },
    'project:delete': {
        title: 'Delete project',
        description: 'Delete project and all its data',
    },
    'project:create': {
        title: 'Create project',
        description: 'Create a new project',
    },
    'project:read': {
        title: 'Read project',
        description: 'Read project details',
    },
    'project:role:edit': {
        title: 'Edit role',
        description: 'Edit role permissions and name',
    },
    'project:role:create': {
        title: 'Create role',
        description: 'Create a new role',
    },
    'project:role:delete': {
        title: 'Delete role',
        description: 'Delete a role',
    },
    'project:member:create': {
        title: 'Add member',
        description: 'Add a new member to the project',
    },
    'project:member:delete': {
        title: 'Remove member',
        description: 'Remove a member or invite from the project',
    },
    'project:member:role:edit': {
        title: 'Edit member role',
        description: 'Edit member role permissions',
    },
}
