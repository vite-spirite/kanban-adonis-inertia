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

router.get('/', [HomeController, 'index']).as('home')

router.get('/register', [HomeController, 'register']).as('register').use(middleware.guest())
router.post('/register', [UserController, 'register']).use(middleware.guest())

router.get('/login', [HomeController, 'login']).as('login').use(middleware.guest())
router.post('/login', [UserController, 'login']).use(middleware.guest())

router
    .group(() => {
        router.get('/', ({ inertia }) => inertia.render('dashboard/index')).as('dashboard.index')
    })
    .prefix('/dashboard')
    .middleware(middleware.auth())
