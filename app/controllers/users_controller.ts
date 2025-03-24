import type { HttpContext } from '@adonisjs/core/http'
import { LoginValidator, RegisterValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { UserService } from '#services/user_service'

@inject()
export default class UsersController {
    constructor(private readonly userService: UserService) {}

    async register({ response, request, auth }: HttpContext) {
        const payload = await RegisterValidator.validate(request.all())

        const user = await this.userService.create(payload)

        if (!user) {
            return response.redirect().back()
        }

        await auth.use('web').login(user, false)
        return response.redirect().toRoute('home')
    }

    async login({ response, request, auth }: HttpContext) {
        const payload = await LoginValidator.validate(request.all())

        if (!payload.rememberMe) {
            payload.rememberMe = false
        }

        const user = await this.userService.verifyCredentials(payload)

        if (!user) {
            return response.redirect().back()
        }

        await auth.use('web').login(user, payload.rememberMe)

        return response.redirect().toRoute('dashboard.index')
    }
}
