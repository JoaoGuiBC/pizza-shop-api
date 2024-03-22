import { Elysia } from 'elysia'
import { eq } from 'drizzle-orm'

import { auth } from '../auth'
import { db } from '@/db/connection'
import { orders } from '@/db/schema'
import { UnauthorizedError } from '../errors/unauthorized-error'

const routeSchema = {
  detail: {
    summary: 'Cancel order',
    tags: ['orders'],
  },
}

export const cancelOrder = new Elysia().use(auth).patch(
  '/orders/:orderId/cancel',
  async ({ getCurrentUser, set, params }) => {
    const { orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, orderId)
      },
    })

    if (!order) {
      set.status = 400
      return { message: 'Order not found.' }
    }

    if (!['pending', 'processing'].includes(order.status)) {
      set.status = 400
      return { message: 'Cannot cancel orders after dispatch.' }
    }

    await db
      .update(orders)
      .set({ status: 'canceled' })
      .where(eq(orders.id, orderId))
  },
  routeSchema,
)
