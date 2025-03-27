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
}
