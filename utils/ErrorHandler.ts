import type { AxiosError } from 'axios'
import { createError } from 'h3'

export class ApiError {
    /**
     * Intercepte une AxiosError et lance un createError H3.
     * @param err AxiosError intercepté
     * @param userMessage Message utilisateur par défaut
     */
    public static handleAxios(err: AxiosError, userMessage = 'Erreur lors de l’appel à l’API'): never {
        if (err.response) {
            const { status, statusText, data } = err.response
            throw createError({
                statusCode:    status,
                statusMessage: statusText,
                data: {
                    message: userMessage,
                    details: data
                }
            })
        }

        throw createError({
            statusCode:    502,
            statusMessage: 'Bad Gateway',
            data: {
                message: userMessage,
                details: err.message
            }
        })
    }
}