import jwt from '@elysiajs/jwt'
import Elysia, { t, type Static } from 'elysia'
import { env } from '../env'
import { UnauthorizedError } from './errors/unauthorized-error'
import { UserNotFoundError } from './errors/user-not-found-error'
import { RestaurantNotFoundError } from './errors/restaurant-not-found-error'

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

export const auth = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
  })
  .onError(({ error, code, set }) => {
    switch (code) {
      case 'UNAUTHORIZED':
        set.status = 401
        return { code, message: error.message }
    }
  })
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayload,
    }),
  )
  .derive({ as: 'global' }, ({ jwt, set, cookie }) => {
    return {
      signUser: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign({
          sub: payload.sub,
          restaurantId: payload.restaurantId,
        })

        set.cookie = {
          auth: {
            value: token,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: '/',
          },
        }
      },

      signOut: () => {
        cookie.auth.remove()
      },

      getCurrentUser: async () => {
        const authCookie = cookie.auth.value

        const payload = await jwt.verify(authCookie)

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
