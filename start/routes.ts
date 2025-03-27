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

const HomeController = () => import('#controllers/home_controller')
const UserController = () => import('#controllers/users_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const ProjectController = () => import('#controllers/projects_controller')

router.get('/', [HomeController, 'index']).as('home')

router.get('/register', [HomeController, 'register']).as('register').use(middleware.guest())
router.post('/register', [UserController, 'register']).use(middleware.guest())

router.get('/login', [HomeController, 'login']).as('login').use(middleware.guest())
router.post('/login', [UserController, 'login']).use(middleware.guest())

router.get('/logout', [UserController, 'logout']).as('logout').use(middleware.auth())

router
    .group(() => {
        router.get('/', [DashboardController, 'index']).as('dashboard.index')

        router.get('/projects/:id', [DashboardController, 'project']).as('dashboard.project')
        router.get('/projects/:id/edit', [DashboardController, 'edit']).as('dashboard.edit')
        router.put('/projects/:id', [ProjectController, 'update'])

        router.post('/projects/:id/role', [ProjectController, 'createRole'])
        router.put('/projects/:id/role/:roleId', [ProjectController, 'updateRolePermission'])
        router.delete('/projects/:id/role/:roleId', [ProjectController, 'deleteRole'])
    })
    .prefix('/dashboard')
    .middleware(middleware.auth())
