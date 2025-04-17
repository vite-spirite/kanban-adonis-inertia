/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import transmit from '@adonisjs/transmit/services/main'

const HomeController = () => import('#controllers/home_controller')
const UserController = () => import('#controllers/users_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const ProjectController = () => import('#controllers/projects_controller')
const ProjectCategoryController = () => import('#controllers/project_categories_controller')
const ProjectTagController = () => import('#controllers/project_tags_controller')
const ProjectTaskController = () => import('#controllers/tasks_controller')
const ProjectTaskListController = () => import('#controllers/lists_controller')
const ProjectTaskAttachmentController = () => import('#controllers/attachments_controller')

transmit.registerRoutes((route) => {
    route.use(middleware.auth())
})

router.get('/', [HomeController, 'index']).as('home')

router.get('/register', [HomeController, 'register']).as('register').use(middleware.guest())
router.post('/register', [UserController, 'register']).use(middleware.guest())

router.get('/login', [HomeController, 'login']).as('login').use(middleware.guest())
router.post('/login', [UserController, 'login']).use(middleware.guest())

router.get('/logout', [UserController, 'logout']).as('logout').use(middleware.auth())

router
    .group(() => {
        router.get('/', [DashboardController, 'index']).as('dashboard.index')
        router
            .get('/projects/create', [DashboardController, 'createProject'])
            .as('dashboard.create')
        router.post('/projects/create', [ProjectController, 'create'])

        router.get('/projects/:id', [DashboardController, 'project']).as('dashboard.project')

        router.get('/projects/:id/edit', [DashboardController, 'edit']).as('dashboard.edit')
        router
            .get('/projects/:id/edit/roles', [DashboardController, 'roles'])
            .as('dashboard.edit.roles')

        router
            .get('/projects/:id/edit/members', [DashboardController, 'members'])
            .as('dashboard.edit.members')

        router.put('/projects/:id', [ProjectController, 'update'])

        router.post('/projects/:id/role', [ProjectController, 'createRole'])
        router.put('/projects/:id/role/:roleId', [ProjectController, 'updateRolePermission'])
        router.delete('/projects/:id/role/:roleId', [ProjectController, 'deleteRole'])

        router.put('/projects/:id/members', [ProjectController, 'updateUserRoles'])
        router.post('/projects/:id/member', [ProjectController, 'createInvite'])
        router.delete('/projects/:id/invites/:inviteId', [ProjectController, 'removeInvite'])

        router.get('/invites', [UserController, 'showInvite'])
        router.get('/invites/:token', [ProjectController, 'acceptInvite'])
        router.get('/invites/:token/reject', [UserController, 'rejectInvite'])

        router.put('/projects/:id/categories/order', [ProjectCategoryController, 'reorder'])
        router.put('/projects/:id/categories/:categoryId', [ProjectCategoryController, 'edit'])
        router.delete('/projects/:id/categories/:categoryId', [ProjectCategoryController, 'delete'])
        router.post('/projects/:id/categories', [ProjectCategoryController, 'create'])

        router.post('/projects/:id/tags', [ProjectTagController, 'create'])
        router.put('/projects/:id/tags', [ProjectTagController, 'edit'])
        router.delete('/projects/:id/tags/:tagId', [ProjectTagController, 'delete'])

        router.get('/projects/:id/tasks/:taskId', [DashboardController, 'task'])
        router.post('/projects/:id/tasks/order', [ProjectTaskController, 'reorder'])
        router.post('/projects/:id/tasks', [ProjectTaskController, 'create'])
        router.post('/projects/:id/tasks/:taskId/tags', [ProjectTaskController, 'updateTags'])
        router.put('/projects/:id/tasks/:taskId', [ProjectTaskController, 'update'])
        router.delete('/projects/:id/tasks/:taskId', [ProjectTaskController, 'delete'])

        router.post(`/projects/:id/tasks/:taskId/lists`, [ProjectTaskListController, 'create'])
        router.put(`/projects/:id/tasks/:taskId/lists/:listId`, [
            ProjectTaskListController,
            'update',
        ])
        router.delete(`/projects/:id/tasks/:taskId/lists/:listId`, [
            ProjectTaskListController,
            'delete',
        ])

        router.post(`/projects/:id/tasks/:taskId/lists/:listId/rows`, [
            ProjectTaskListController,
            'createRow',
        ])

        router.post(`/projects/:id/tasks/:taskId/lists/:listId/rows/:rowId/check`, [
            ProjectTaskListController,
            'toggleRow',
        ])

        router.delete(`/projects/:id/tasks/:taskId/lists/:listId/rows/:rowId`, [
            ProjectTaskListController,
            'deleteRow',
        ])

        router.put(`/projects/:id/tasks/:taskId/lists/:listId/rows/:rowId`, [
            ProjectTaskListController,
            'updateRow',
        ])

        router
            .get('/projects/attachment/:attachmentId', [
                ProjectTaskAttachmentController,
                'download',
            ])
            .as('dashboard.download.attachment')

        router.post('/projects/:id/tasks/:taskId/attachments', [
            ProjectTaskAttachmentController,
            'upload',
        ])

        router.delete('/projects/:id/tasks/:taskId/attachments/:attachmentId', [
            ProjectTaskAttachmentController,
            'delete',
        ])
    })
    .prefix('/dashboard')
    .middleware(middleware.auth())
