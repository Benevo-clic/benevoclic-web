import type {RegisterResponse} from "~/common/types/register.type";
import type {LoginResponse} from "~/common/types/auth.type";

export interface RegisterDone{
    registerResponse: RegisterResponse,
    loginResponse: LoginResponse
}