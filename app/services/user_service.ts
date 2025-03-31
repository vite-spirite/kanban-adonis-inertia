import User from '#models/user'

export type RegisterDto = {
    fullName: string
    email: string
    password: string
}

export type LoginDto = {
    email: string
    password: string
    rememberMe?: boolean
}

export class UserService {
    async create(payload: RegisterDto): Promise<User | null> {
        return User.create({
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password,
        })
    }

    async verifyCredentials(payload: LoginDto): Promise<User | null> {
        const user = await User.verifyCredentials(payload.email, payload.password)

        if (!user) {
            return null
        }

        return user
    }

    async findById(id: number): Promise<User | null> {
        return User.query().where('id', id).first()
    }
}
