import type {RegisterResponse} from "~/common/types/register.type";
import type {LoginResponse} from "~/common/types/auth.type";

export interface RegisterDone{
    registerResponse: RegisterResponse,
    loginResponse: LoginResponse
}

export type FormFields = {
    name: string
    firstName: string
    phone: string
    birthDate: string
    city: string
    postalCode: string
    bio: string
}

export type CreateVolunteerDto = FormFields & {
    email: string
}