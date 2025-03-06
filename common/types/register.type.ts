import type {RoleUser} from "~/common/enums/role.enum";

export type RegisterPayload =  {
    email: string,
    password: string,
    role: RoleUser
}

export type RegisterResponse = {
    uid: string,
    email?: string,
}