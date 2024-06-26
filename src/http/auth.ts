import jwt from '@elysiajs/jwt'
import cookie from '@elysiajs/cookie'
import { Elysia, t, type Static } from 'elysia'

import { env } from '@/env'
import { UnauthorizedError } from './errors/unauthorized-error'

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

export const auth = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayload,
    }),
  )
  .use(cookie())
  .derive(({ jwt: { sign, verify }, setCookie, removeCookie, cookie }) => {
    return {
      signUser: async (payload: Static<typeof jwtPayload>) => {
        const jwt = await sign(payload)

        setCookie('auth', jwt, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        })
      },

      signOut: () => {
        removeCookie('auth')
      },

      getCurrentUser: async () => {
        const payload = await verify(cookie.auth)

        if (!payload) {
          throw new UnauthorizedError()
        }

        return {
          userId: payload.sub,
          restaurantId: payload.restaurantId,
        }
      },
    }
  })
