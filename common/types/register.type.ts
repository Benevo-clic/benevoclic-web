import type {RoleUser} from "~/common/enums/role.enum";

export type RegisterPayload =  {
    email: string,
    password: string,
    role: RoleUser
}

export type RegisterEmailVerifiedPayload = {
    email: string,
    role: RoleUser,
}

export type RegisterEmailVerifiedResponse = {
    idToken: string
    refreshToken: string
    expiresIn: string
}

export type RegisterResponse = {
    uid: string,
    email?: string,
}