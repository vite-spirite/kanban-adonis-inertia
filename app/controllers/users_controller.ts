import type { HttpContext } from '@adonisjs/core/http'
import { LoginValidator, RegisterValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { UserService } from '#services/user_service'
import { InvitePresenter } from '#presenters/invite_presenter'
import transmit from '@adonisjs/transmit/services/main'

@inject()
export default class UsersController {
    constructor(private readonly userService: UserService) {}

    async register({ response, request, auth }: HttpContext) {
        const payload = await RegisterValidator.validate(request.all())

        const user = await this.userService.create(payload)

        if (!user) {
            return response.redirect().back()
        }

        await this.userService.updateAllInviteByEmail(user.email, user.id)

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

    async logout({ response, auth }: HttpContext) {
        await auth.use('web').logout()
        return response.redirect().toRoute('home')
    }

    async showInvite({ response, inertia, auth }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const invites = await this.userService.findInviteByUser(auth.user)

        return inertia.render('dashboard/invites', {
            invites: invites.map((i) => new InvitePresenter(i).present()),
        })
    }

    async rejectInvite({ response, params, auth }: HttpContext) {
        if (!auth.user) {
            return response.redirect().back()
        }

        const token = params.token

        const invite = await this.userService.findInviteByToken(token)
        if (!invite || invite.userId !== auth.user.id) {
            return response.redirect().back()
        }

        await invite.delete()
        return response.redirect().back()
    }
}
