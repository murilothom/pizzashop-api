import Elysia, { t } from 'elysia'
import { auth } from '../auth'
import { db } from '../../db/connection'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { eq } from 'drizzle-orm'
import { orders } from '../../db/schema'

export const deliverOrder = new Elysia().use(auth).patch(
  '/orders/:orderId/deliver',
  async ({ params, getCurrentUser, set }) => {
    const { orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      where(fields, operators) {
        return operators.and(
          operators.eq(fields.id, orderId),
          operators.eq(fields.restaurantId, restaurantId),
        )
      },
    })

    if (!order) {
      set.status = 404
      return { message: 'Order not found' }
    }

    if (order.status !== 'delivering') {
      set.status = 409
      return {
        message:
          'You cannot deliver orders that are not in "delivering" status',
      }
    }

    await db
      .update(orders)
      .set({ status: 'delivered' })
      .where(eq(orders.id, orderId))
  },
  { params: t.Object({ orderId: t.String() }) },
)
