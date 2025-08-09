import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const refreshToken = getCookie(event, 'refresh_token')
  const authToken = getCookie(event, 'auth_token')

  return {
    hasTokens: !!(refreshToken && authToken)
  }
})
