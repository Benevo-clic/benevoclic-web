export type LoginPayload =  {
    email: string
    password: string
}

export type LoginResponse = {
    idToken: string
    refreshToken: string
    expiresIn: string
}