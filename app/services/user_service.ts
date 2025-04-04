import User from '#models/user'
import ProjectInvite from '#models/project_invite'

/**
 * Data transfer object for user registration
 */
export type RegisterDto = {
    fullName: string
    email: string
    password: string
}

/**
 * Data transfer object for user login
 */
export type LoginDto = {
    email: string
    password: string
    rememberMe?: boolean
}

export class UserService {
    /**
     * Create a new user
     * @param payload User registration data
     * @returns Newly created user or null if creation fails
     */
    async create(payload: RegisterDto): Promise<User | null> {
        return User.create(this.mapRegisterDtoToUserData(payload))
    }

    /**
     * Map registration DTO to User model data
     * @param payload Registration data
     * @returns User model compatible data object
     */
    private mapRegisterDtoToUserData(payload: RegisterDto): {
        fullName: string
        email: string
        password: string
    } {
        return {
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password,
        }
    }

    /**
     * Verify user credentials for login
     * @param payload Login credentials
     * @returns Authenticated user or null if verification fails
     */
    async verifyCredentials(payload: LoginDto): Promise<User | null> {
        return User.verifyCredentials(payload.email, payload.password)
    }

    /**
     * Find a user by ID
     * @param id User ID
     * @returns User if found, null otherwise
     */
    async findById(id: number): Promise<User | null> {
        return this.findByField('id', id)
    }

    /**
     * Find a user by email
     * @param email User email
     * @returns User if found, null otherwise
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.findByField('email', email)
    }

    /**
     * Generic method to find a user by a specific field
     * @param field Field name to search by
     * @param value Value to search for
     * @returns User if found, null otherwise
     */
    private async findByField(field: string, value: any): Promise<User | null> {
        return User.query().where(field, value).first()
    }

    async updateAllInviteByEmail(email: string, id: number): Promise<ProjectInvite[]> {
        return ProjectInvite.query().where('email', email).update({ userId: id })
    }

    async findInviteByUser(user: User): Promise<ProjectInvite[]> {
        return user.related('invites').query().preload('project')
    }

    async findInviteByToken(token: string): Promise<ProjectInvite | null> {
        return ProjectInvite.query().where('token', token).first()
    }
}
