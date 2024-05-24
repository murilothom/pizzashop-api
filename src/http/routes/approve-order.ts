import Elysia, { t } from 'elysia'
import { auth } from '../auth'
import { db } from '../../db/connection'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { eq } from 'drizzle-orm'
import { orders } from '../../db/schema'

export const approveOrder = new Elysia().use(auth).patch(
  '/orders/:orderId/approve',
  async ({ params, getCurrentUser, set }) => {
    const { orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, orderId)
      },
    })

    if (!order) {
      set.status = 404
      return { message: 'Order not found' }
    }

    if (order.status !== 'pending') {
      set.status = 409
      return { message: 'You cannot approve orders that are not pending' }
    }

    await db
      .update(orders)
      .set({ status: 'processing' })
      .where(eq(orders.id, orderId))
  },
  { params: t.Object({ orderId: t.String() }) },
)
