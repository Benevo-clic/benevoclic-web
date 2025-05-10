import type {RoleUser} from "~/common/enums/role.enum";

export type RegisterPayload =  {
    email: string,
    password: string,
    role: RoleUser
}

export type RegisterVolunteerPayload = {
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    bio: string,
    city: string,
    postalCode: string,
    country: string,
    birthDate: string
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