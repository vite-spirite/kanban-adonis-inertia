import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
    async index({ inertia }: HttpContext) {
        return inertia.render('home')
    }

    async register({ inertia }: HttpContext) {
        return inertia.render('register')
    }
}
