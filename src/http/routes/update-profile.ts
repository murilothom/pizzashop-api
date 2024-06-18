import Elysia, { t } from 'elysia'
import { auth } from '../auth'
import { db } from '../../db/connection'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { restaurants } from '../../db/schema'
import { eq } from 'drizzle-orm'

export const updateProfile = new Elysia().use(auth).put(
  '/profile',
  async ({ getCurrentUser, set, body }) => {
    const { restaurantId } = await getCurrentUser()
    const { name, description } = body

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const restaurant = await db.query.restaurants.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, restaurantId)
      },
    })

    if (!restaurant) {
      set.status = 404
      return { message: 'Restaurant not found' }
    }

    await db
      .update(restaurants)
      .set({ name, description })
      .where(eq(restaurants.id, restaurantId))

    set.status = 204
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
    }),
  },
)
