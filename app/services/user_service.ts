import User from '#models/user'

export type RegisterDto = {
    fullName: string
    email: string
    password: string
}

export class UserService {
    async create(payload: RegisterDto): Promise<User | null> {
        return User.create({
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password,
        })
    }
}
